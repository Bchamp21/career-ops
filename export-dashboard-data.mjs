#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)));
const DASHBOARD_REPO = resolve(process.env.DASHBOARD_REPO_PATH || '/Users/bhuvanchamp/Documents/Projects/Job Search/job-search-dashboard');
const OUT_PATH = resolve(DASHBOARD_REPO, 'data/jobs.json');
const publish = process.argv.includes('--publish');

const PIPELINE_PATH = resolve(ROOT, 'data/pipeline.md');
const APPS_PATH = resolve(ROOT, 'data/applications.md');
const SUMMARY_PATH = resolve(ROOT, 'data/email-application-summary.md');

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function parsePipeline(text) {
  const jobs = [];
  const lineRe = /^- \[(?<checked>[ x])\] (?<url>https?:\/\/\S+)\s+\|\s+(?<company>[^|]+)\|\s+(?<role>[^|]+)(?:\|\s*(?<status>.+))?$/gm;
  for (const match of text.matchAll(lineRe)) {
    const { checked, url, company, role, status } = match.groups;
    const rawStatus = (status || '').trim();
    const rejected = checked === 'x' || /reject|non-us|not confirmed/i.test(rawStatus);
    jobs.push({
      company: company.trim(),
      role: role.trim(),
      status: rawStatus || (checked === 'x' ? 'Processed' : 'Found - needs review'),
      url,
      source: new URL(url).hostname.replace(/^www\./, ''),
      dateFound: null,
      remotePolicy: null,
      contractType: null,
      visaC2C: null,
      score: null,
      needsReview: !rejected,
      eligibleToApply: !rejected,
      rejectionReason: rejected ? rawStatus : null
    });
  }
  return jobs;
}

function parseApplications(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    if (!line.startsWith('|') || line.includes('|---') || line.includes('| # |')) continue;
    const cols = line.split('|').slice(1, -1).map(c => c.trim());
    if (cols.length < 9) continue;
    rows.push({
      number: cols[0],
      date: cols[1],
      company: cols[2],
      role: cols[3],
      score: cols[4],
      status: cols[5],
      pdf: cols[6],
      report: cols[7],
      notes: cols[8]
    });
  }
  return rows;
}

function summaryCount(summary, source, email) {
  const escapedSource = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\|\\s*${escapedSource}\\s*\\|\\s*${escapedEmail}\\s*\\|\\s*([^|]+)\\|`, 'i');
  const match = summary.match(re);
  return match ? match[1].trim() : '0';
}

function countPendingEligible(jobs) {
  return jobs.filter(job => job.eligibleToApply).length;
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function publishIfChanged() {
  const status = git(['status', '--short', 'data/jobs.json'], DASHBOARD_REPO);
  if (!status) {
    console.log('Dashboard data unchanged; nothing to publish.');
    return;
  }
  git(['add', 'data/jobs.json'], DASHBOARD_REPO);
  git(['commit', '-m', 'Update live job dashboard data'], DASHBOARD_REPO);
  git(['push', 'origin', 'main'], DASHBOARD_REPO);
  console.log('Published dashboard data to GitHub Pages repo.');
}

function stableData(data) {
  const clone = JSON.parse(JSON.stringify(data));
  delete clone.generatedAt;
  return clone;
}

const pipelineText = read(PIPELINE_PATH);
const applicationsText = read(APPS_PATH);
const summaryText = read(SUMMARY_PATH);
const jobs = parsePipeline(pipelineText);
const applications = parseApplications(applicationsText);

const data = {
  generatedAt: new Date().toISOString(),
  refreshIntervalMinutes: 15,
  filters: {
    include: ['US only', 'Remote', 'C2C / corp-to-corp', 'H1B compatible'],
    exclude: ['W2 only', 'Onsite only', 'Hybrid only', 'No sponsorship', 'No C2C', 'Clearance only']
  },
  audit: {
    totalEmailConfirmed: '1247+',
    linkedin: summaryCount(summaryText, 'LinkedIn', 'bhuvansarakam@gmail.com'),
    dice: Number(summaryCount(summaryText, 'Dice', 'bhuvansarakam@gmail.com')) || 0,
    bchamp248: 0,
    pendingC2C: countPendingEligible(jobs),
    agentApplied: applications.filter(a => /^Applied$/i.test(a.status) && !/Gmail|LinkedIn \/ Gmail|Dice \/ Gmail/i.test(a.company)).length
  },
  jobs,
  applications
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
let changed = true;
if (existsSync(OUT_PATH)) {
  try {
    const previous = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
    changed = JSON.stringify(stableData(previous)) !== JSON.stringify(stableData(data));
  } catch {
    changed = true;
  }
}

if (changed) {
  writeFileSync(OUT_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${OUT_PATH}`);
} else {
  console.log(`Dashboard data unchanged; kept ${OUT_PATH}`);
}
console.log(`Jobs exported: ${jobs.length}; pending eligible: ${data.audit.pendingC2C}`);

if (publish && changed) {
  publishIfChanged();
} else if (publish) {
  console.log('No dashboard publish needed.');
}
