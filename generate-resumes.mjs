#!/usr/bin/env node
/**
 * generate-resumes.mjs
 * Generates 5 tailored HTML CVs + PDFs for target companies.
 * Run: node generate-resumes.mjs
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const template = await readFile(resolve(__dirname, 'templates/cv-template.html'), 'utf8');

function renderHtml(replacements) {
  let html = template;
  for (const [key, val] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, val);
  }
  return html;
}

function generatePdf(htmlPath, pdfOutputPath) {
  return new Promise((res, rej) => {
    const child = spawn(
      'node',
      [resolve(__dirname, 'generate-pdf.mjs'), htmlPath, pdfOutputPath, '--format=letter'],
      { stdio: 'inherit', cwd: __dirname }
    );
    child.on('close', code => (code === 0 ? res() : rej(new Error(`PDF failed: code ${code}`))));
  });
}

// ─── SHARED STATIC BLOCKS ─────────────────────────────────────────────────────

const EDUCATION = `
<div class="edu-item">
  <div class="edu-header">
    <span class="edu-title">M.S. Management Sciences &amp; Quantitative Data Analytics</span>
    <span class="edu-year">2024–2025</span>
  </div>
  <div class="edu-desc"><span class="edu-org">Mount Vernon Nazarene University</span></div>
</div>
<div class="edu-item">
  <div class="edu-header">
    <span class="edu-title">M.S. Applied Computer Science</span>
    <span class="edu-year">2021–2022</span>
  </div>
  <div class="edu-desc"><span class="edu-org">Northwest Missouri State University</span></div>
</div>
<div class="edu-item">
  <div class="edu-header">
    <span class="edu-title">M.Tech &amp; B.Tech, Mechanical Engineering (Intelligent Manufacturing)</span>
    <span class="edu-year">2011–2016</span>
  </div>
  <div class="edu-desc"><span class="edu-org">Indian Institute of Technology, Madras</span></div>
</div>`;

const CERTIFICATIONS = `
<div class="cert-item">
  <span class="cert-title">Certified Data Scientist — <span class="cert-org">INSOFE</span></span>
  <span class="cert-year">2016</span>
</div>
<div class="cert-item">
  <span class="cert-title">Big Data Foundations Level 1 — <span class="cert-org">IBM</span></span>
  <span class="cert-year">—</span>
</div>
<div class="cert-item">
  <span class="cert-title">AmEx Data Science Championship Winner — Risk Modeling &amp; Transaction Analysis</span>
  <span class="cert-year">Nov 2017</span>
</div>`;

const PROJECTS = `
<div class="project">
  <div class="project-title">LLM Agentic Portfolio Risk Attribution <span class="project-badge">Production · Janus Henderson</span></div>
  <div class="project-desc">Designed and deployed an LLM-powered agentic decisioning workflow with RAG-based retrieval over MSCI, FactSet, Aladdin, and Atlas, improving portfolio risk attribution accuracy 30% through context-aware multi-step reasoning and prompt-optimized re-ranking.</div>
  <div class="project-tech">Azure Databricks · LangChain · RAG · Prompt Engineering · Python · Azure DevOps</div>
</div>
<div class="project">
  <div class="project-title">MLOps Platform Modernization <span class="project-badge">Production · Janus Henderson</span></div>
  <div class="project-desc">Operationalized end-to-end MLOps — model registry, automated drift monitoring, and CI/CD-based deployment — achieving 99.8% SLA compliance and 60% faster ML release cycles across LLM and traditional ML production workloads at scale.</div>
  <div class="project-tech">Azure DevOps · MLflow · Databricks · Delta Lake · Python · CI/CD</div>
</div>`;

// ─── EXPERIENCE BLOCKS (bullet order tuned per JD) ────────────────────────────

const EXP_TEAM_VELOCITY = `
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors</span>
    <span class="job-period">Sept 2024 – Present</span>
  </div>
  <div class="job-role">Application Engineer — Data Science, LLM/RAG &amp; MLOps <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Operationalized end-to-end MLOps — model registry, automated drift monitoring, and CI/CD via Azure DevOps — achieving <strong>99.8% SLA compliance</strong> and 60% faster release cycles for production ML/LLM workflows.</li>
    <li>Built ML-based propensity/opportunity-scoring models across a <strong>$73B AUM pipeline</strong> using XGBoost/LightGBM ensemble scoring with LLM re-ranking, improving institutional win rates 15%.</li>
    <li>Designed LLM-powered agentic decisioning workflow (RAG + prompt engineering + output validation) integrated with MSCI, FactSet, Aladdin, and Atlas — improving portfolio risk attribution accuracy <strong>30%</strong>.</li>
    <li>Applied prompt engineering and output validation frameworks ensuring LLM insights were accurate, explainable, and <strong>audit-ready</strong> — directly applicable to automotive marketing attribution accuracy.</li>
    <li>Automated reconciliation and data-quality workflows, resolving <strong>150+ issues per quarter</strong> and cutting manual effort 60% — establishing observability patterns across the enterprise data platform.</li>
    <li>Partnered cross-functionally with global engineering, compliance, and business stakeholders to translate AI/ML capabilities into scalable production decisioning and reporting platforms.</li>
    <li>Engineered .NET Core and Python APIs for enterprise Product Master MDM across <strong>500+ funds/share classes</strong>, reducing data-delivery latency 25%.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors (Contract)</span>
    <span class="job-period">May 2023 – Sept 2024</span>
  </div>
  <div class="job-role">Sr. Cloud Data Developer <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Led ML signal-scoring tools for institutional opportunity identification across $73B AUM using ensemble techniques + rule-based logic, expanding global investable-universe coverage <strong>35%</strong>.</li>
    <li>Designed real-time Databricks/Spark pipelines feeding Power BI alerting layer, improving response time <strong>25%</strong> through low-latency data integration.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">American Express</span>
    <span class="job-period">Jan 2017 – Jan 2018</span>
  </div>
  <div class="job-role">Data Engineer – Fraud Analyst (NLP/ML) <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Built KModes clustering + SGD fraud propensity models improving detection accuracy <strong>18%</strong> on high-volume transactional data — same scoring pattern as churn and CLV modeling.</li>
    <li>Engineered SQL-based NLP engine for synthetic account detection, blocking <strong>25%</strong> of fraudulent applications; built Spark/Kafka/Airflow pipelines cutting latency 40%.</li>
    <li>Won <strong>AmEx Data Science Championship</strong> for credit risk and transaction analysis research.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">TransUnion CIBIL Limited</span>
    <span class="job-period">Oct 2018 – Nov 2019</span>
  </div>
  <div class="job-role">Data Engineer – Credit Risk Modeling <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Built CECL pipelines (Azure Data Factory + Event Hubs) for survival PD/EAD credit risk models, achieving <strong>&lt;10% quarterly error rate</strong>; led 3-analyst team delivering 2 weeks ahead of schedule.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Citi</span>
    <span class="job-period">Feb 2018 – Sept 2018</span>
  </div>
  <div class="job-role">Data Analyst – Credit Risk Modeling <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Built Decision Tree ML models optimizing Credit Line Decrease policy, cutting loss rates <strong>20bps</strong> while increasing approval rates — data-driven decisioning enabling multi-million dollar policy optimization.</li>
  </ul>
</div>`;

const EXP_FANATICS = `
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors</span>
    <span class="job-period">Sept 2024 – Present</span>
  </div>
  <div class="job-role">Application Engineer — Data Science, LLM/RAG &amp; MLOps <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Designed and deployed LLM-powered agentic decisioning workflow with RAG retrieval over MSCI, FactSet, Aladdin, and Atlas — improving portfolio risk attribution accuracy <strong>30%</strong> through context-aware scoring and prompt-optimized re-ranking.</li>
    <li>Built ensemble ML opportunity-scoring pipeline across a <strong>$73B AUM dataset</strong> (XGBoost/LightGBM + LLM re-ranking), improving institutional win rates 15% — directly analogous to fan behavior scoring and purchase propensity at scale.</li>
    <li>Operationalized MLOps infrastructure — model registry, drift monitoring, CI/CD — achieving <strong>99.8% SLA compliance</strong> and 60% faster release cycles for production ML and LLM workloads.</li>
    <li>Partnered cross-functionally with global engineering, compliance, and business stakeholders to translate AI/ML into production-ready decisioning and reporting platforms.</li>
    <li>Engineered Python/.NET Core APIs for enterprise MDM across <strong>500+ funds/share classes</strong>, reducing latency 25%; automated 150+ data-quality issue resolutions per quarter.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors (Contract)</span>
    <span class="job-period">May 2023 – Sept 2024</span>
  </div>
  <div class="job-role">Sr. Cloud Data Developer <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Led AI-driven opportunity-identification platform with ensemble ML scoring on Databricks/PySpark across $73B AUM, expanding coverage <strong>35%</strong> for global distribution teams.</li>
    <li>Designed real-time Spark pipelines feeding Power BI alerting layer, improving response time <strong>25%</strong> through low-latency streaming data integration.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">American Express</span>
    <span class="job-period">Jan 2017 – Jan 2018</span>
  </div>
  <div class="job-role">Data Engineer – Fraud Analyst (NLP/ML) <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Built unsupervised/supervised ML models (KModes clustering + SGD) for fraud propensity detection, improving accuracy <strong>18%</strong> on high-volume transactional data.</li>
    <li>Spark/Kafka/Airflow real-time pipelines cutting fraud data latency 40%; won <strong>AmEx Data Science Championship</strong> for credit risk research.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Hubbell Incorporated</span>
    <span class="job-period">Jun 2020 – Aug 2021</span>
  </div>
  <div class="job-role">Data Engineer <span class="job-location">| Bangalore, India</span></div>
  <ul>
    <li>Built Azure Data Factory + Power BI pipelines surfacing revenue opportunities, recovering <strong>15% revenue leakage</strong>; automated data refresh from daily to hourly (<strong>80% faster</strong>) for real-time reporting.</li>
  </ul>
</div>`;

const EXP_GC_AI = `
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors</span>
    <span class="job-period">Sept 2024 – Present</span>
  </div>
  <div class="job-role">Application Engineer — Data Science, LLM/RAG &amp; MLOps <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Designed and deployed LLM-powered agentic decisioning workflow with multi-step reasoning and RAG-based retrieval over enterprise sources (MSCI, FactSet, Aladdin, Atlas) — improving portfolio risk attribution accuracy <strong>30%</strong> through context-aware ranking.</li>
    <li>Built retrieval-layer data integration feeding LLM re-ranking logic into AI/ML scoring models across a <strong>$73B AUM pipeline</strong>, improving institutional win rates 15% through production-grade GenAI output.</li>
    <li>Applied prompt engineering, output validation, and observability frameworks ensuring LLM-generated insights were accurate, explainable, and <strong>audit-ready</strong> with full chain-of-thought traceability.</li>
    <li>Engineered Python and .NET Core APIs for enterprise Product Master MDM, enabling scalable integration across <strong>500+ funds/share classes</strong> and reducing latency 25%.</li>
    <li>Operationalized MLOps — model registry, drift monitoring, CI/CD — achieving <strong>99.8% SLA compliance</strong> and 60% faster release cycles for LLM and ML workloads.</li>
    <li>Partnered with engineering, compliance, and global business stakeholders to translate GenAI capabilities into production-ready decisioning platforms.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors (Contract)</span>
    <span class="job-period">May 2023 – Sept 2024</span>
  </div>
  <div class="job-role">Sr. Cloud Data Developer <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Led AI-driven opportunity platform using ensemble ML + rule-based orchestration on Databricks/PySpark across $73B AUM — expanding coverage <strong>35%</strong> with explainable, audit-ready AI outputs.</li>
    <li>Designed real-time Spark pipelines with low-latency data integration and Power BI alerting, improving stakeholder response time 25%.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">American Express</span>
    <span class="job-period">Jan 2017 – Jan 2018</span>
  </div>
  <div class="job-role">Data Engineer – Fraud Analyst (NLP/ML) <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Engineered SQL-based NLP pattern-recognition engine for automated text analytics — foundational retrieve-and-classify architecture predating modern RAG patterns, blocking <strong>25%</strong> of synthetic account applications.</li>
    <li>Built Spark/Kafka/Airflow real-time pipelines; won <strong>AmEx Data Science Championship</strong> for risk research.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Cognizant</span>
    <span class="job-period">Jun 2016 – Jan 2017</span>
  </div>
  <div class="job-role">Data Engineer (Associate Data Scientist) <span class="job-location">| Bangalore, India</span></div>
  <ul>
    <li>Created IBM Watson NLP chatbot using Conversation API for IT ticket allocation, reducing resolution time <strong>30%</strong> — foundational conversational AI/NLP experience predating current LLM tooling.</li>
    <li>Deployed 5 ML models achieving <strong>92% accuracy</strong> vs. 78% baseline; built AWS EC2/S3/Step Functions ETL pipelines automating 85% of workflows.</li>
  </ul>
</div>`;

const EXP_PARAFIN = `
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors</span>
    <span class="job-period">Sept 2024 – Present</span>
  </div>
  <div class="job-role">Application Engineer — Data Science, LLM/RAG &amp; MLOps <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Operationalized end-to-end MLOps platform — model registry, automated drift monitoring, and CI/CD deployment via Azure DevOps — achieving <strong>99.8% SLA compliance</strong> and 60% faster release cycles for production ML and LLM workloads.</li>
    <li>Engineered Python and .NET Core APIs for enterprise Product Master MDM, enabling scalable integration across <strong>500+ funds/share classes</strong> and reducing data-delivery latency 25%.</li>
    <li>Built retrieval-layer data pipelines feeding LLM re-ranking into AI/ML scoring models across a <strong>$73B AUM pipeline</strong>, improving institutional win rates 15%.</li>
    <li>Automated reconciliation and data-quality workflows, resolving <strong>150+ issues per quarter</strong> and cutting manual effort 60% — systematic observability across the enterprise data platform.</li>
    <li>Designed LLM-powered agentic workflow with RAG-based retrieval over MSCI, FactSet, Aladdin, Atlas — improving portfolio risk attribution accuracy 30%.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">TransUnion CIBIL Limited</span>
    <span class="job-period">Oct 2018 – Nov 2019</span>
  </div>
  <div class="job-role">Data Engineer – Credit Risk Modeling <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Built CECL pipelines (Azure Data Factory + Event Hubs) for survival PD/EAD credit risk models — <strong>directly applicable to FinTech ML platforms</strong> — achieving &lt;10% quarterly error rate.</li>
    <li>Led 3-analyst data science team delivering production models <strong>2 weeks ahead of schedule</strong>, integrating Azure Data Lake with enterprise risk reporting systems.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Citi</span>
    <span class="job-period">Feb 2018 – Sept 2018</span>
  </div>
  <div class="job-role">Data Analyst – Credit Risk Modeling <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Built Decision Tree ML models optimizing Credit Line Decrease policy, cutting loss rates <strong>20bps</strong> while increasing approval rates — data-driven decisioning enabling multi-million dollar FinTech policy optimization.</li>
    <li>Developed predictive models in Python/SAS forecasting EBIT, RAR, and CLD volume impacts for enterprise stakeholders.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">American Express</span>
    <span class="job-period">Jan 2017 – Jan 2018</span>
  </div>
  <div class="job-role">Data Engineer – Fraud Analyst (NLP/ML) <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Built Spark/Kafka/Airflow real-time pipelines cutting fraud latency 40%; KModes + SGD fraud detection models improving accuracy 18% on high-volume FinTech transactional data.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors (Contract)</span>
    <span class="job-period">May 2023 – Sept 2024</span>
  </div>
  <div class="job-role">Sr. Cloud Data Developer <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Designed real-time Databricks/Spark pipelines with low-latency data integration; led ML scoring platform across $73B AUM expanding coverage 35%.</li>
  </ul>
</div>`;

const EXP_DROPZONE = `
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors</span>
    <span class="job-period">Sept 2024 – Present</span>
  </div>
  <div class="job-role">Application Engineer — Data Science, LLM/RAG &amp; MLOps <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Designed and deployed LLM-powered agentic decisioning workflow with multi-step reasoning and RAG retrieval over enterprise sources (MSCI, FactSet, Aladdin, Atlas) — improving risk attribution accuracy <strong>30%</strong> through intelligent triage and context-aware pattern-matching.</li>
    <li>Applied prompt engineering and output validation frameworks ensuring LLM-generated insights were accurate, explainable, and audit-ready — with full observability into model reasoning chains.</li>
    <li>Built retrieval-layer architecture feeding LLM re-ranking into AI/ML scoring models across a <strong>$73B AUM pipeline</strong>, improving win rates 15% through production GenAI workflows.</li>
    <li>Operationalized MLOps — model registry, drift monitoring, CI/CD — achieving <strong>99.8% SLA compliance</strong> and 60% faster release cycles for LLM and ML production systems.</li>
    <li>Engineered Python and .NET Core APIs for enterprise MDM across <strong>500+ funds/share classes</strong>; automated data-quality workflows resolving 150+ issues/quarter.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">American Express</span>
    <span class="job-period">Jan 2017 – Jan 2018</span>
  </div>
  <div class="job-role">Data Engineer – Fraud Analyst (NLP/ML) <span class="job-location">| Haryana, India</span></div>
  <ul>
    <li>Engineered SQL-based NLP pattern-recognition engine detecting synthetic account creation, blocking <strong>25%</strong> of fraudulent applications — automated threat-pattern analysis directly analogous to SOC alert triage and classification.</li>
    <li>Built KModes clustering + SGD anomaly-detection models improving threat detection accuracy <strong>18%</strong> on high-volume transactional streams — unsupervised anomaly patterns applicable to security event classification.</li>
    <li>Built Spark/Kafka/Airflow real-time pipelines cutting data latency 40%; won <strong>AmEx Data Science Championship</strong> for risk analysis.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Janus Henderson Investors (Contract)</span>
    <span class="job-period">May 2023 – Sept 2024</span>
  </div>
  <div class="job-role">Sr. Cloud Data Developer <span class="job-location">| Denver, CO</span></div>
  <ul>
    <li>Led AI-driven opportunity platform with ensemble ML + rule-based orchestration on Databricks/PySpark across $73B AUM — explainable, audit-ready AI output with 35% coverage expansion.</li>
  </ul>
</div>
<div class="job">
  <div class="job-header">
    <span class="job-company">Cognizant</span>
    <span class="job-period">Jun 2016 – Jan 2017</span>
  </div>
  <div class="job-role">Data Engineer (Associate Data Scientist) <span class="job-location">| Bangalore, India</span></div>
  <ul>
    <li>Created IBM Watson NLP chatbot (Conversation API) reducing IT ticket resolution time <strong>30%</strong> — foundational conversational AI/NLP predating current LLM tooling.</li>
    <li>Deployed 5 ML models achieving <strong>92% accuracy</strong> vs. 78% baseline for seismic event prediction; built AWS ETL pipelines automating 85% of workflows.</li>
  </ul>
</div>`;

// ─── COMPANY CONFIGS ──────────────────────────────────────────────────────────

const companies = [
  {
    slug: 'team-velocity',
    SUMMARY_TEXT: `Senior Data Scientist with 10+ years building production ML systems — propensity/churn/CLV scoring, predictive modeling, and MLOps infrastructure — now extended into LLM/RAG-powered decisioning workflows. At Janus Henderson Investors, operationalized ML opportunity-scoring models across a $73B AUM pipeline (XGBoost/LightGBM ensemble + LLM re-ranking), achieving 99.8% SLA compliance and 60% faster release cycles through rigorous MLOps (model registry, drift monitoring, CI/CD). Deep expertise in Snowflake, dbt, Airflow, and LangChain-based RAG pipelines — directly applicable to Team Velocity's Apollo&#174; platform and data-driven automotive marketing intelligence. <em>Note: H1B sponsorship/transfer required.</em>`,
    COMPETENCIES: `<span class="competency-tag">Propensity &amp; Churn Modeling</span><span class="competency-tag">Customer Lifetime Value (CLV)</span><span class="competency-tag">Lead Scoring &amp; Attribution</span><span class="competency-tag">LLM / RAG Pipelines</span><span class="competency-tag">XGBoost / LightGBM / Random Forest</span><span class="competency-tag">Model Monitoring &amp; Drift Detection</span><span class="competency-tag">MLflow / MLOps CI/CD</span><span class="competency-tag">Snowflake / dbt / Airflow</span><span class="competency-tag">A/B Testing &amp; Causal Inference</span><span class="competency-tag">Python &amp; SQL Expert</span><span class="competency-tag">Azure Databricks / PySpark</span><span class="competency-tag">Feature Engineering at Scale</span>`,
    EXPERIENCE: EXP_TEAM_VELOCITY,
    SKILLS: `<div class="skills-grid">
  <span class="skill-category">ML &amp; Predictive Analytics:</span><span class="skill-item">Propensity / Churn / CLV Modeling · XGBoost · LightGBM · Random Forest · Neural Networks · Statistical Analysis · A/B Testing · Causal Inference · Feature Engineering · NLP</span><br/>
  <span class="skill-category">LLM / RAG / GenAI:</span><span class="skill-item">LangChain / LangGraph · RAG Pipelines · Vector Databases · Prompt Engineering · Output Validation · Claude / OpenAI / Gemini APIs</span><br/>
  <span class="skill-category">MLOps &amp; Engineering:</span><span class="skill-item">MLflow · CI/CD (Azure DevOps) · Model Drift Detection · Python · SQL · Airflow · Spark · Kafka</span><br/>
  <span class="skill-category">Data Platforms:</span><span class="skill-item">Snowflake · dbt · Azure Databricks · Delta Lake · Azure Data Factory · AWS (S3, EC2, Redshift)</span>
</div>`,
  },
  {
    slug: 'fanatics',
    SUMMARY_TEXT: `Senior Data Scientist with 10+ years building production ML systems for predictive scoring, recommendation engines, and LLM/RAG-powered AI workflows at enterprise scale. At Janus Henderson Investors, engineered ensemble ML opportunity-scoring models across a $73B AUM pipeline, improving win rates 15% through context-aware LLM re-ranking — directly transferable to purchase propensity and fan engagement scoring at Fanatics. Deep expertise in real-time Databricks/Spark pipelines, MLOps (99.8% SLA compliance, 60% faster release cycles), and LLM/RAG agentic systems integrated with enterprise data sources. <em>Note: H1B sponsorship/transfer required.</em>`,
    COMPETENCIES: `<span class="competency-tag">Recommendation &amp; Propensity Modeling</span><span class="competency-tag">Customer Behavior Analytics</span><span class="competency-tag">LLM / RAG Pipelines</span><span class="competency-tag">Real-Time Databricks / Spark</span><span class="competency-tag">Ensemble ML (XGBoost / LightGBM)</span><span class="competency-tag">A/B Testing &amp; Experimentation</span><span class="competency-tag">MLOps &amp; Model Monitoring</span><span class="competency-tag">Python &amp; SQL Expert</span><span class="competency-tag">Feature Engineering at Scale</span><span class="competency-tag">NLP &amp; Sentiment Analysis</span><span class="competency-tag">Azure / AWS Cloud ML</span><span class="competency-tag">Cross-Functional AI Delivery</span>`,
    EXPERIENCE: EXP_FANATICS,
    SKILLS: `<div class="skills-grid">
  <span class="skill-category">ML &amp; Data Science:</span><span class="skill-item">Recommendation Systems · Propensity Modeling · XGBoost · LightGBM · Deep Learning · A/B Testing · Feature Engineering · NLP &amp; Sentiment Analysis · Fraud Detection ML</span><br/>
  <span class="skill-category">LLM / RAG / GenAI:</span><span class="skill-item">LLM Agentic Workflows · RAG Pipelines · Vector Databases · Prompt Engineering · GPT / Claude APIs · LangChain Orchestration</span><br/>
  <span class="skill-category">Data Platforms:</span><span class="skill-item">Azure Databricks · PySpark · Delta Lake · Snowflake · Azure Data Factory · AWS (S3, EC2, Redshift)</span><br/>
  <span class="skill-category">MLOps &amp; Engineering:</span><span class="skill-item">MLOps &amp; Model Deployment · CI/CD (Azure DevOps) · Drift Monitoring · Python · SQL · Spark · Kafka · Airflow</span>
</div>`,
  },
  {
    slug: 'gc-ai',
    SUMMARY_TEXT: `Senior AI/LLM Engineer with 10+ years designing and deploying production LLM/RAG pipelines, agentic decisioning systems, and enterprise AI integrations. At Janus Henderson Investors, designed an LLM-powered agentic workflow with multi-step reasoning and RAG-based retrieval over MSCI, FactSet, Aladdin, and Atlas — improving portfolio risk attribution accuracy 30% and win rates 15% through prompt-optimized context-aware scoring. End-to-end GenAI expertise: retrieval architecture, prompt engineering, output validation, vector databases, and MLOps deployment. Ready to build production AI systems at GC AI. <em>Note: H1B sponsorship/transfer required.</em>`,
    COMPETENCIES: `<span class="competency-tag">LLM / RAG Pipeline Design</span><span class="competency-tag">Agentic AI Workflow Engineering</span><span class="competency-tag">Prompt Engineering &amp; Validation</span><span class="competency-tag">Vector Databases &amp; Retrieval</span><span class="competency-tag">Enterprise API Integration</span><span class="competency-tag">Production GenAI at Scale</span><span class="competency-tag">Python &amp; ML Engineering</span><span class="competency-tag">MLOps &amp; Model Serving</span><span class="competency-tag">GPT / Claude / LangChain</span><span class="competency-tag">Azure Databricks / Delta Lake</span><span class="competency-tag">NLP &amp; Semantic Search</span><span class="competency-tag">Cross-Domain AI Application</span>`,
    EXPERIENCE: EXP_GC_AI,
    SKILLS: `<div class="skills-grid">
  <span class="skill-category">LLM / RAG / GenAI:</span><span class="skill-item">Agentic Workflows · RAG Pipelines · Vector Databases · Prompt Engineering · Output Validation · GPT / Claude APIs · LangChain / LangGraph · Enterprise API Integration</span><br/>
  <span class="skill-category">ML &amp; Data Science:</span><span class="skill-item">Predictive Modeling · NLP &amp; Semantic Analysis · Deep Learning · XGBoost · Feature Engineering · Credit Risk ML · Fraud Detection</span><br/>
  <span class="skill-category">Engineering &amp; MLOps:</span><span class="skill-item">Python · SQL · .NET Core/C# · MLOps · CI/CD (Azure DevOps) · Airflow · Kafka · Spark · Git</span><br/>
  <span class="skill-category">Data Platforms:</span><span class="skill-item">Azure Databricks · PySpark · Delta Lake · Unity Catalog · Snowflake · Azure (ADF, Synapse, ADLS Gen2) · AWS (S3, EC2, Redshift)</span>
</div>`,
  },
  {
    slug: 'parafin',
    SUMMARY_TEXT: `Senior ML Platform &amp; Data Engineer with 10+ years building production ML infrastructure, enterprise data pipelines, and MLOps platforms across Databricks, Azure, and AWS. At Janus Henderson Investors, operationalized end-to-end MLOps — model registry, automated drift monitoring, CI/CD via Azure DevOps — achieving 99.8% SLA compliance and 60% faster ML release cycles across LLM and traditional workloads. Prior credit risk ML expertise (CECL PD/EAD pipelines at Citi and TransUnion CIBIL) directly maps to FinTech ML platform requirements; combined with Spark/Kafka/Airflow real-time pipeline experience and enterprise-scale data integration across 500+ financial instruments. <em>Note: H1B sponsorship/transfer required.</em>`,
    COMPETENCIES: `<span class="competency-tag">ML Platform Engineering &amp; MLOps</span><span class="competency-tag">Model Registry &amp; Drift Monitoring</span><span class="competency-tag">Feature Engineering at Scale</span><span class="competency-tag">Azure Databricks / PySpark / Delta Lake</span><span class="competency-tag">Credit Risk ML (CECL, PD, EAD)</span><span class="competency-tag">Kafka / Airflow / Spark Pipelines</span><span class="competency-tag">Python &amp; SQL Expert</span><span class="competency-tag">CI/CD (Azure DevOps)</span><span class="competency-tag">AWS (EC2, S3, Redshift, EMR)</span><span class="competency-tag">LLM / RAG Deployment</span><span class="competency-tag">Enterprise Data Integration</span><span class="competency-tag">API Engineering (.NET Core / Python)</span>`,
    EXPERIENCE: EXP_PARAFIN,
    SKILLS: `<div class="skills-grid">
  <span class="skill-category">MLOps &amp; Platform Engineering:</span><span class="skill-item">MLOps &amp; Model Deployment · Model Registry · Drift Monitoring · CI/CD (Azure DevOps) · Feature Stores · Airflow · Kafka · Spark</span><br/>
  <span class="skill-category">Data Platforms:</span><span class="skill-item">Azure Databricks · PySpark · Delta Lake · Unity Catalog · Snowflake · Azure Data Factory · Event Hubs · ADLS Gen2 · AWS (EC2, S3, Redshift, RDS, EMR)</span><br/>
  <span class="skill-category">ML &amp; Data Science (FinTech):</span><span class="skill-item">Credit Risk ML (CECL, PD, EAD) · Fraud Detection · Propensity Modeling · XGBoost · LightGBM · Feature Engineering · Python · SQL</span><br/>
  <span class="skill-category">Engineering &amp; LLM:</span><span class="skill-item">.NET Core / C# · Python APIs · LLM / RAG Pipelines · Prompt Engineering · Vector Databases · GPT / Claude APIs</span>
</div>`,
  },
  {
    slug: 'dropzone-ai',
    SUMMARY_TEXT: `Senior AI/LLM Engineer with 10+ years building production LLM/RAG pipelines, agentic decisioning systems, and NLP-based pattern-recognition engines — directly applicable to SOC automation and LLM-powered threat detection. At Janus Henderson Investors, designed a multi-step agentic AI workflow with RAG retrieval over MSCI, FactSet, and Aladdin, improving risk attribution accuracy 30% through intelligent context-aware triage. Prior NLP and fraud-detection work at American Express — KModes clustering, SQL-based synthetic account detection blocking 25% of fraudulent applications — maps directly to security event classification and threat-pattern analysis. Deep expertise in prompt engineering, output validation, and production MLOps. <em>Note: H1B sponsorship/transfer required.</em>`,
    COMPETENCIES: `<span class="competency-tag">LLM-Powered Agentic Systems</span><span class="competency-tag">RAG &amp; Retrieval Architecture</span><span class="competency-tag">NLP &amp; Pattern Recognition</span><span class="competency-tag">Prompt Engineering &amp; Validation</span><span class="competency-tag">Anomaly &amp; Threat Detection ML</span><span class="competency-tag">Enterprise API Integration</span><span class="competency-tag">Production AI Research &amp; Deployment</span><span class="competency-tag">Python &amp; ML Engineering</span><span class="competency-tag">MLOps &amp; Model Serving</span><span class="competency-tag">Vector Databases &amp; Semantic Search</span><span class="competency-tag">Azure Databricks / Delta Lake</span><span class="competency-tag">Real-Time Data Pipelines</span>`,
    EXPERIENCE: EXP_DROPZONE,
    SKILLS: `<div class="skills-grid">
  <span class="skill-category">LLM / RAG / GenAI:</span><span class="skill-item">Agentic Workflows · RAG Pipelines · Vector Databases · Prompt Engineering · Output Validation · Claude / GPT APIs · LangChain Orchestration</span><br/>
  <span class="skill-category">ML &amp; NLP (Security Domain):</span><span class="skill-item">NLP &amp; Semantic Analysis · Anomaly / Fraud Detection · KModes Clustering · SGD Models · XGBoost · Deep Learning · Feature Engineering</span><br/>
  <span class="skill-category">Engineering &amp; MLOps:</span><span class="skill-item">Python · SQL · .NET Core/C# · MLOps · CI/CD (Azure DevOps) · Spark · Kafka · Airflow</span><br/>
  <span class="skill-category">Data Platforms:</span><span class="skill-item">Azure Databricks · PySpark · Delta Lake · Snowflake · Azure (ADF, ADLS Gen2) · AWS (S3, EC2, Redshift)</span>
</div>`,
  },
];

// ─── COMMON PLACEHOLDERS ──────────────────────────────────────────────────────

const COMMON = {
  LANG: 'en',
  NAME: 'Bhuvan S',
  PAGE_WIDTH: '8.5in',
  PHONE: '+1 (678) 989-6307',
  EMAIL: 'bhuvansarakam@gmail.com',
  LINKEDIN_URL: 'https://linkedin.com/in/bhuvansdata',
  LINKEDIN_DISPLAY: 'linkedin.com/in/bhuvansdata',
  PORTFOLIO_URL: 'https://github.com/Bchamp21',
  PORTFOLIO_DISPLAY: 'github.com/Bchamp21',
  LOCATION: 'Denver, CO',
  SECTION_SUMMARY: 'Professional Summary',
  SECTION_COMPETENCIES: 'Core Competencies',
  SECTION_EXPERIENCE: 'Work Experience',
  SECTION_PROJECTS: 'Key Projects',
  SECTION_EDUCATION: 'Education',
  SECTION_CERTIFICATIONS: 'Certifications &amp; Awards',
  SECTION_SKILLS: 'Technical Skills',
  EDUCATION,
  CERTIFICATIONS,
  PROJECTS,
};

const DATE = '2026-07-01';

// ─── GENERATE ALL ─────────────────────────────────────────────────────────────

for (const co of companies) {
  const { slug, ...content } = co;
  const data = { ...COMMON, ...content };
  const html = renderHtml(data);

  const htmlPath = `/tmp/cv-bhuvan-s-${slug}.html`;
  await writeFile(htmlPath, html, 'utf8');
  console.log(`[${slug}] HTML written → ${htmlPath}`);

  const pdfPath = resolve(__dirname, `output/cv-bhuvan-s-${slug}-${DATE}.pdf`);
  console.log(`[${slug}] Generating PDF → ${pdfPath}`);
  await generatePdf(htmlPath, pdfPath);
  console.log(`[${slug}] Done.`);
}

console.log('\nAll 5 tailored CVs generated successfully.');
console.log('PDFs are in output/ — upload each one when applying.');
