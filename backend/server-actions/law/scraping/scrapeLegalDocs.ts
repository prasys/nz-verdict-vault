'use server';

interface DocumentChunk {
    url: string;
    doc_id: string;
    chunk_id: number;
    text: string;
}

const SCRAPING_CONFIG = {
    baseUrl: "http://www.nzlii.org/nz/cases/NZHRRT/2024/",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "http://www.google.com"
    },
    // List all the relative links (add more as needed)
    relativeLinks: [
        "../2024/1.html",
        "../2024/2.html",
        "../2024/3.html",
        "../2024/4.html",
        "../2024/7.html",
        "../2024/8.html",
        "../2024/9.html",
        "../2024/10.html",
        "../2024/11.html",
        "../2024/12.html",
        "../2024/13.html",
        "../2024/15.html",
        "../2024/16.html",
        "../2024/17.html",
        "../2024/19.html",
        "../2024/20.html",
        "../2024/21.html",
        "../2024/22.html",
        "../2024/24.html",
        "../2024/25.html",
        "../2024/26.html",
        "../2024/28.html",
        "../2024/37.html",
        "../2024/38.html",
        "../2024/39.html",
        "../2024/41.html",
        "../2024/46.html",
        "../2024/47.html",
        "../2024/48.html",
        "../2024/49.html",
        "../2024/52.html",
        "../2024/54.html",
        "../2024/59.html",
        "../2024/63.html",
        "../2024/64.html",
        "../2024/66.html",
        "../2024/67.html",
        "../2024/68.html",
        "../2024/69.html",
        // … additional links …
    ]
};

/**
 * Main function: fetches each URL, cleans the text, then groups text using
 * reference markers as natural boundaries while combining them into chunks
 * that are not too granular.
 */
export async function scrapeLegalDocs() {
    const documents: DocumentChunk[] = [];

    // Normalize relative links into full URLs.
    const urls = SCRAPING_CONFIG.relativeLinks.map(link =>
        SCRAPING_CONFIG.baseUrl + link.replace("../2024/", "")
    );

    for (const url of urls) {
        try {
            const response = await fetch(url, { headers: SCRAPING_CONFIG.headers });
            if (!response.ok) {
                console.warn(`Skipping ${url} - received status ${response.status}`);
                continue;
            }
            const html = await response.text();

            // Extract text from the <body> (you can customize the extraction if needed)
            const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            const bodyText = bodyMatch ? bodyMatch[1] : "";
            // Remove HTML tags, replace HTML entities, and collapse whitespace.
            const cleanText = bodyText
                .replace(/<[^>]+>/g, ' ')
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Group the text using reference markers (e.g. "[1]", "[2]", …)
            // and combine parts until they reach a maximum length with sliding window
            const chunks = groupByReferenceMarkers(cleanText, 2000); // Increased maxChunkLength to 2000

            chunks.forEach((chunk, index) => {
                documents.push({
                    url,
                    doc_id: url.split("/").pop() || "",
                    chunk_id: index + 1,
                    text: chunk
                });
            });
        } catch (error) {
            console.error(`Error processing ${url}:`, error);
        }
    }

    return {
        documents,
        totalDocuments: urls.length,
        totalChunks: documents.length
    };
}

/**
 * Splits and groups the text based on reference markers (e.g. "[1]", "[2]", etc.).
 *
 * The algorithm:
 *  1. Splits the text wherever a reference marker is encountered (using a lookahead).
 *  2. Iterates over the resulting parts and groups them together until the combined
 *     length reaches maxChunkLength.
 *  3. Implements a sliding window with overlap to preserve context between chunks.
 *
 * @param text The complete cleaned text from the document.
 * @param maxChunkLength Maximum allowed length (in characters) for each chunk.
 * @returns An array of text chunks.
 */
function groupByReferenceMarkers(text: string, maxChunkLength: number = 1500): string[] {
    // Split on positions where a reference marker appears (lookahead for a bracketed number).
    const parts = text.split(/(?=\[\d+\])/);
    const chunks: string[] = [];
    const overlapSize = 200; // Number of characters to overlap
    let currentChunk = "";

    for (const part of parts) {
        const trimmedPart = part.trim();
        if (!trimmedPart) continue;

        // If adding this part would exceed the maximum length…
        if ((currentChunk + " " + trimmedPart).length > maxChunkLength) {
            if (currentChunk.trim().length > 0) {
                chunks.push(currentChunk.trim());
                // Start new chunk with overlap
                currentChunk = currentChunk.slice(-overlapSize) + " " + trimmedPart;
            }
            // If the individual part is longer than maxChunkLength, we push it alone.
            if (trimmedPart.length > maxChunkLength) {
                chunks.push(trimmedPart);
                currentChunk = "";
            } else {
                currentChunk += " " + trimmedPart;
            }
        } else {
            // Otherwise, keep appending.
            currentChunk += " " + trimmedPart;
        }
    }
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}
