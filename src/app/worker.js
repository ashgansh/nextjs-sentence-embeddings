const { pipeline, cos_sim, env } = require("@xenova/transformers");

// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
    self.postMessage({
        status: "initiate",
    });
    const { query, sentences, } = event.data;

    const extractor = await PipelineSingleton.getInstance(data => {
        self.postMessage({
            status: 'download',
            data: data
        });
    });

    const vectors = await extractor([query, ...sentences], {
        pooling: "mean",
        normalize: true
    });
    const [queryVector, ...sentencesVectors] = vectors;

    const scores = sentencesVectors.map((vector, index) => {
        const simScore = cos_sim(queryVector.data, vector.data);
        return {
            sentence: sentences[index],
            score: simScore
        };
    });

    console.log(scores)
    self.postMessage({
        status: "complete",
        data: scores.sort((a, b) => b.score - a.score)
    });
});