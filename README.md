# NZ Verdict Vault

An AI-powered legal research assistant and search engine for New Zealand legal cases.

## 🔍 Overview

NZ Verdict Vault is a sophisticated legal research platform that leverages AI, embeddings, and natural language processing to make legal research efficient and accessible. The platform scrapes legal cases, processes them with GPT, categorizes them, and provides multiple ways to find relevant legal information.

## ✨ Key Features

- **AI-Powered Legal Chat**: Ask legal questions in natural language
- **Semantic Search**: Find cases based on meaning, not just keywords
- **Category Browsing**: Navigate through pre-categorized legal domains
- **Case Analysis**: Detailed breakdowns of legal decisions and principles
- **Embedding-Based Retrieval**: State-of-the-art vector search for accuracy

## 🏛️ Architecture

The system consists of several integrated components:

### 1. Data Collection & Processing

- Web scraping of legal documents from nzlii.org
- Processing raw legal text using GPT-4o
- Creating structured summaries with categories, key principles, and decisions
- Storing processed data in JSON format

### 2. Embedding Generation

- Converting case summaries into vector embeddings using OpenAI's text-embedding-3-small model
- Combining relevant fields (title, summary, topics, decision, principles, categories)
- Storing embeddings alongside original summaries

### 3. Search & Retrieval

- Converting user queries to embeddings
- Performing vector similarity search using cosine similarity
- Ranking and returning the most relevant cases
- Presenting results with relevance scores

### 4. Case Organization

- Pre-categorizing cases during analysis
- Building a category index with case counts
- Providing category-based browsing and filtering
- Contextual display of related information

### 5. User Interface

- Modern, responsive React interface
- Chat interface for legal questions
- Search page with filters and suggested queries
- Case browser with categorization
- Detailed case view with key issues and principles

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, TailwindCSS
- **AI & Embeddings**: OpenAI API (GPT-4o, text-embedding-3-small)
- **Data Processing**: Node.js server actions
- **Vector Search**: Custom cosine similarity implementation
- **UI Components**: Headless UI, React Icons, MDX

## 📦 Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn
```

2. Set up environment variables:
Create a `.env.local` file and add:
```
OPENAI_API_KEY=your_openai_api_key
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

### Dependencies Installation

When deploying to production or running in CI pipelines, you might encounter lockfile synchronization issues. If you see the following error:

```
Use the following command to update the lockfile:

```bash
pnpm install --no-frozen-lockfile
```

After updating the lockfile, commit the changes to your repository to prevent this issue in future deployments.

For local development, it's recommended to run standard `pnpm install` to ensure consistent dependencies.

## 💡 Usage

### Generating Case Summaries

1. Navigate to `/law/summarize`
2. Click "Start Summarization" to process legal documents
3. Check `data/legal-summaries.json` for the results

### Generating Embeddings

1. Use the embedding generation functionality:
```bash
# Access through the API route
curl http://localhost:3000/api/embedding/generate
```

### Using the Search

1. Navigate to `/law/search`
2. Enter a legal query in natural language
3. Browse through relevant cases by similarity

### Using the Chat

1. Navigate to `/law/chat`
2. Ask legal questions in natural language
3. View the AI response with relevant case citations

## 🧩 System Components

### Key Server Actions

- `summarizeLegalDocuments`: Processes legal documents with GPT
- `embedLegalSummaries`: Converts summaries to embeddings
- `searchLegalDocuments`: Performs semantic search
- `getCategories`: Retrieves category information

### Key Components

- `ClientLayout`: Manages conditional layout rendering
- `Sidebar`: Provides navigation and context
- `CategoriesProvider`: Shares category data
- `CaseCard`: Displays case information
- `MessageContent`: Renders chat responses

## 🙏 Acknowledgments

- Data sourced from the New Zealand Legal Information Institute (nzlii.org)
- Built with OpenAI's language and embedding models
- Created using Next.js framework

