import { SamplePaper } from '../types';

export const SAMPLE_PAPERS: SamplePaper[] = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
    year: '2017',
    category: 'Architecture / NLP',
    description: 'Introduces the Transformer, dispensing with recurrence and convolutions entirely in favor of self-attention mechanisms.',
    text: `Attention Is All You Need

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.

1 Introduction
Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.

2 Model Architecture
The Transformer follows an encoder-decoder architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder.
Encoder: The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers: a multi-head self-attention mechanism, and a simple, position-wise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization.
Decoder: The decoder is also composed of a stack of N = 6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack.
Attention: An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.
Scaled Dot-Product Attention: We compute the attention function on a set of queries simultaneously, packed together into a matrix Q. The keys and values are also packed into matrices K and V. We compute the matrix of outputs as:
Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V.
Multi-Head Attention: Instead of performing a single attention function with d_model-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively.

3 Training & Results
We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens. For English-French, we used the significantly larger WMT 2014 English-French dataset consisting of 36 million sentences.
On the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big)) outperforms the best reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4. On the English-to-French task, our big model achieves a BLEU score of 41.8, outperforming all previously published single models and ensembles, at 1/4 the training cost of the previous state-of-the-art model.
Hardware: We trained our models on one machine with 8 NVIDIA P100 GPUs. For our base models, each training step took about 0.4 seconds. We trained the base models for a total of 100,000 steps or 12 hours. For our big models, step time was 1.0 second. The big models were trained for 300,000 steps (3.5 days).

4 Limitations & Future Work
While Transformer reduces training time significantly and eliminates sequential bottleneck during training, standard autoregressive generation during inference still requires sequential decoding step-by-step. Furthermore, self-attention exhibits quadratic complexity O(n^2) with respect to input sequence length n, limiting scalability for extremely long contexts and document-level tasks without specialized chunking or sparse attention patterns.`,
    cachedAnalysis: {
      id: 'attention-is-all-you-need-analysis',
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
      year: '2017',
      venue: 'NeurIPS 2017',
      objective: 'To replace recurrent and convolutional neural network architectures in sequence transduction with a pure attention-based mechanism that eliminates sequential dependency and maximizes parallelization.',
      methodology: {
        summary: 'Introduces the Transformer encoder-decoder architecture utilizing multi-head scaled dot-product self-attention and position-wise feed-forward sublayers with residual connections and layer normalization.',
        coreTechniques: [
          'Scaled Dot-Product Attention: softmax(QK^T / sqrt(d_k))V',
          'Multi-Head Attention (h=8 heads)',
          'Sinusoidal Positional Encodings',
          'Residual connections and Layer Normalization'
        ],
        datasets: ['WMT 2014 English-German (4.5M pairs)', 'WMT 2014 English-French (36M pairs)'],
        hardwareOrCompute: '8 NVIDIA P100 GPUs (12 hours for base model, 3.5 days for big model)'
      },
      findings: [
        {
          metricOrDiscovery: '28.4 BLEU on WMT 2014 English-to-German',
          detail: 'Outperformed existing state-of-the-art including ensembles by over 2.0 BLEU.'
        },
        {
          metricOrDiscovery: '41.8 BLEU on WMT 2014 English-to-French',
          detail: 'Established new single-model SOTA at a fraction (1/4) of previous training compute costs.'
        },
        {
          metricOrDiscovery: 'Training efficiency',
          detail: 'Base model trained in only 12 hours on 8 P100 GPUs (0.4s per step).'
        }
      ],
      limitations: {
        isMentioned: true,
        text: 'Autoregressive generation at inference time remains strictly sequential. Furthermore, self-attention exhibits quadratic computational and memory complexity O(n^2) with respect to sequence length, constraining ultra-long context processing.'
      },
      keyTakeaways: [
        'Recurrence is not essential for superior sequence modeling; self-attention alone captures intra-sequence dependencies effectively.',
        'Massive parallelization across tokens yields orders-of-magnitude faster training cycles than LSTMs/GRUs.',
        'Foundation architecture for nearly all modern frontier LLMs, vision transformers, and multimodal models.'
      ],
      citation: {
        title: 'Attention Is All You Need',
        authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
        year: '2017',
        venue: 'Advances in Neural Information Processing Systems (NeurIPS)',
        bibtex: `@inproceedings{vaswani2017attention,
  author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N. and Kaiser, {\\L}ukasz and Polosukhin, Illia},
  title     = {Attention Is All You Need},
  booktitle = {Advances in Neural Information Processing Systems 30 (NeurIPS)},
  year      = {2017}
}`,
        apa: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998–6008.'
      },
      markdown: `# Research Paper Analysis

## 🎯 Objective
Replace recurrent and convolutional sequence transduction models with a novel, simpler architecture based purely on attention mechanisms to overcome sequential computational bottlenecks and enhance translation quality.

## ⚙️ Methodology
- **Architecture**: Transformer encoder-decoder framework (6 stacked layers each).
- **Core Mechanism**: Multi-Head Scaled Dot-Product Attention: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V with 8 heads and d_model = 512.
- **Positional Encoding**: Fixed sinusoidal functions added to input and output embeddings to encode token ordering.
- **Datasets**: WMT 2014 English-to-German (4.5M sentence pairs) and WMT 2014 English-to-French (36M sentence pairs).
- **Compute**: 8 NVIDIA P100 GPUs for 12 hours (base) or 3.5 days (big).

## 📊 Findings
- Achieved **28.4 BLEU** on WMT 2014 English-to-German, surpassing previous best models and ensembles by over 2.0 BLEU.
- Reached **41.8 BLEU** on WMT 2014 English-to-French, outperforming prior single models at 1/4 the compute cost.
- Demonstrated exceptional training parallelization, reducing step time to 0.4s for base model.

## ⚠️️ Limitations
Autoregressive inference generation remains sequential token-by-token. Additionally, standard self-attention has quadratic O(n^2) compute and memory complexity relative to sequence length n, restricting applicability to long documents without context sharding.

## 💡 Key Takeaways
- Self-attention mechanisms completely dispense with recurrence while achieving higher representational quality.
- Removing recurrent state dependency allows unconstrained training parallelization on modern GPU hardware.
- Forms the core technological blueprint for contemporary large language modeling (BERT, GPT, T5, LLaMA).`,
      sourceText: '',
      analyzedAt: 1718000000000,
      sourceType: 'sample'
    }
  },
  {
    id: 'lora-low-rank-adaptation',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: 'Edward J. Hu, Yelong Shen, Phillip Wallis, Zeyuan Allen-Zhu, Yuanzhi Li, Shean Wang, Lu Wang, Weizhu Chen',
    year: '2021',
    category: 'Parameter-Efficient Fine-Tuning (PEFT)',
    description: 'Freezes pre-trained model weights and injects trainable rank decomposition matrices into each layer, reducing trainable parameters by 10,000x.',
    text: `LoRA: Low-Rank Adaptation of Large Language Models

Abstract
An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to specific tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. Using GPT-3 175B as an example -- deploying independent instances of fine-tuned models, each with 175B parameters, is prohibitively expensive. We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks. Compared to fine-tuning of GPT-3 175B with Adam, LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times. LoRA performs on-par or better than fine-tuning in model quality on RoBERTa, DeBERTa, GPT-2, and GPT-3, despite having fewer trainable parameters, a higher training throughput, and, unlike adapters, no additional inference latency.

1 Introduction
Many applications in natural language processing rely on adapting one large-scale, pre-trained language model to multiple downstream applications. Such adaptation is typically done via fine-tuning, which updates all the parameters of the pre-trained model. The major downside of fine-tuning is that the new model contains as many parameters as the original model. For instance, storing and deploying a 175B parameter model for each downstream task requires significant hardware infrastructure.
We seek to answer: can we parameter-efficiently adapt large models without sacrificing quality or adding inference latency?
Drawing inspiration from Li et al. (2018a); Aghajanyan et al. (2020) showing that the learned over-parametrized models in fact reside on a low intrinsic dimension, we hypothesize that the updates to the weights also have a low "intrinsic rank" during adaptation.

2 Methodology
For a pre-trained weight matrix W_0 in R^{d x k}, we constrain its update by representing the latter with a low-rank decomposition:
W = W_0 + Delta W = W_0 + B * A
where B in R^{d x r}, A in R^{r x k}, and the rank r << min(d, k).
During training, W_0 is frozen and does not receive gradient updates, while A and B contain trainable parameters. Note that both W_0 and Delta W = BA are multiplied with the same input x:
h = W_0 x + Delta W x = W_0 x + (B * A) x
We initialize A with a random Gaussian distribution N(0, sigma^2) and B with zero, so Delta W = BA is zero at the beginning of training. We then scale Delta W x by alpha / r, where alpha is a constant in r.
At deployment, we can explicitly compute and store W = W_0 + BA and perform inference as usual. No extra latency is introduced during inference because no extra layers are added.

3 Empirical Results
We evaluate LoRA on RoBERTa-base, RoBERTa-large, DeBERTa-XXL, GPT-2 medium/large, and GPT-3 175B across GLUE benchmarks, WikiSQL, and SAMSum.
- On GPT-3 175B, LoRA matches or exceeds full fine-tuning performance (e.g. 73.4% on WikiSQL vs 73.8% for full FT; 53.8 Rouge-1 on SAMSum vs 52.0 for full FT).
- LoRA reduces trainable parameters of GPT-3 175B from 175 Billion to only 37.7 Million (approx 4,600x to 10,000x reduction when r=4).
- GPU VRAM consumption during training is reduced by up to 3x (e.g. from 1.2TB memory footprint down to 350GB), enabling training on fewer or smaller GPUs.
- Zero inference latency overhead: because W = W_0 + BA can be folded directly into original model weights before serving.

4 Limitations
LoRA is not without limitations. First, batching inputs for different tasks that use different LoRA adapters in a single forward pass is non-trivial if the weights are merged; without weight merging, dynamically routing different tokens to different low-rank matrices incurs routing overhead. Second, LoRA updates are tied to a specific base model checkpoint; if the base model is updated or restructured, all LoRA weights must be re-trained from scratch.`,
    cachedAnalysis: {
      id: 'lora-low-rank-adaptation-analysis',
      title: 'LoRA: Low-Rank Adaptation of Large Language Models',
      authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'Yuanzhi Li', 'Shean Wang', 'Lu Wang', 'Weizhu Chen'],
      year: '2021',
      venue: 'ICLR 2022',
      objective: 'Address the prohibitively high computational and storage costs of full parameter fine-tuning for large language models by developing a parameter-efficient adaptation technique that retains full model performance without introducing inference latency.',
      methodology: {
        summary: 'Freezes pre-trained weight matrices W_0 and injects trainable rank decomposition matrices (Delta W = B * A, where r << min(d, k)). Only A and B are updated via backpropagation, with weights folded into W_0 at inference.',
        coreTechniques: [
          'Low-Rank Decomposition: W = W_0 + (alpha/r) * B * A',
          'Weight matrix freezing for base Transformer layers',
          'Zero-initialization of B and Gaussian initialization of A',
          'Weight folding at inference to eliminate latency overhead'
        ],
        datasets: ['GLUE benchmark', 'WikiSQL', 'SAMSum dialogue summarization'],
        hardwareOrCompute: 'Evaluated up to GPT-3 175B parameters; reduces training VRAM by 3x'
      },
      findings: [
        {
          metricOrDiscovery: '10,000x parameter reduction on GPT-3 175B',
          detail: 'Reduced trainable parameters from 175 billion to 37.7 million (r=4) while matching or surpassing full fine-tuning.'
        },
        {
          metricOrDiscovery: 'Superior benchmark accuracy',
          detail: 'Achieved 53.8 Rouge-1 on SAMSum (vs 52.0 for full fine-tuning) and 73.4% on WikiSQL.'
        },
        {
          metricOrDiscovery: '3x GPU VRAM reduction & zero inference latency',
          detail: 'Reduced memory consumption during training from 1.2TB to ~350GB and added 0ms inference overhead via weight merging.'
        }
      ],
      limitations: {
        isMentioned: true,
        text: 'Batching inputs for different tasks that use different adapters in a single forward pass is difficult without dynamic matrix routing overhead. Additionally, adapter weights are coupled to the exact base model checkpoint and cannot transfer across different base model architectures.'
      },
      keyTakeaways: [
        'Weight updates during task adaptation have an intrinsically low rank dimension.',
        'Low-rank decomposition eliminates the need to duplicate billions of weights for task customization.',
        'Enables high-throughput multi-tenant model serving via on-the-fly adapter swapping.'
      ],
      citation: {
        title: 'LoRA: Low-Rank Adaptation of Large Language Models',
        authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'Yuanzhi Li', 'Shean Wang', 'Lu Wang', 'Weizhu Chen'],
        year: '2021',
        venue: 'International Conference on Learning Representations (ICLR)',
        bibtex: `@inproceedings{hu2021lora,
  author    = {Edward J. Hu and Yelong Shen and Phillip Wallis and Zeyuan Allen-Zhu and Yuanzhi Li and Shean Wang and Lu Wang and Weizhu Chen},
  title     = {{LoRA}: Low-Rank Adaptation of Large Language Models},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2022}
}`,
        apa: 'Hu, E. J., Shen, Y., Wallis, P., Allen-Zhu, Z., Li, Y., Wang, S., Wang, L., & Chen, W. (2021). LoRA: Low-rank adaptation of large language models. In International Conference on Learning Representations (ICLR 2022).'
      },
      markdown: `# Research Paper Analysis

## 🎯 Objective
Mitigate the prohibitive compute, storage, and deployment costs of retraining all parameters in large language models (such as GPT-3 175B) for downstream domain adaptation without sacrificing task accuracy or adding inference latency.

## ⚙️ Methodology
- **Decomposition Principle**: Constrains weight updates Delta W to a low-rank product B * A, where B in R^{d x r} and A in R^{r x k} with rank r << min(d, k).
- **Weight Freezing**: Base pre-trained weight matrices W_0 remain fixed; only low-rank matrices A and B receive gradient updates.
- **Initialization & Scaling**: A is initialized with Gaussian N(0, sigma^2), B with zeros; scaled by alpha/r.
- **Serving Architecture**: Weights can be pre-merged (W = W_0 + BA) for deployment, guaranteeing zero additional FLOPs or runtime latency.
- **Evaluations**: Tested across RoBERTa, DeBERTa, GPT-2, and GPT-3 175B on GLUE, WikiSQL, and SAMSum.

## 📊 Findings
- Reduced trainable parameters of GPT-3 175B by up to **10,000x** (from 175B to 37.7M with r=4).
- Lowered peak GPU memory requirement during training by **3x** (from 1.2TB to ~350GB).
- Matches or outperforms full fine-tuning performance across benchmarks (e.g. 53.8 Rouge-1 on SAMSum vs 52.0 for full FT).
- Incurs **0 ms** extra inference latency when weights are folded.

## ⚠️️ Limitations
Simultaneously batching inputs for multiple downstream tasks with distinct LoRA weights requires dynamic routing or unmerged execution, introducing computational overhead. Adapters are strictly checkpoint-dependent and cannot be transferred to different base models.

## 💡 Key Takeaways
- The parameter space updated during task fine-tuning has a very low intrinsic rank.
- Storing lightweight adapter weights (~20MB) enables deploying hundreds of customized models from a single frozen base model.
- Established the standard paradigm for modern parameter-efficient fine-tuning (PEFT).`,
      sourceText: '',
      analyzedAt: 1718000000000,
      sourceType: 'sample'
    }
  },
  {
    id: 'flash-attention',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: 'Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Ré',
    year: '2022',
    category: 'Systems / Hardware Efficiency',
    description: 'An exact attention algorithm that uses tiling to reduce memory reads/writes between GPU HBM and on-chip SRAM, yielding 2-4x speedups.',
    text: `FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness

Abstract
Transformers are slow and memory-hungry on long sequences, since the time and memory complexity of self-attention are quadratic in sequence length. Approximate attention methods have attempted to address this by trading off model quality to reduce the compute complexity, but often do not achieve wall-clock speedup. We argue that a missing principle is making attention algorithms IO-aware -- accounting for reads and writes between levels of GPU memory. We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and GPU on-chip SRAM. We analyze the IO complexity of FlashAttention, proving that it requires fewer HBM accesses than standard attention and is asymptotically optimal. We also extend FlashAttention to block-sparse attention, yielding an approximate attention algorithm that is faster than any existing approximate attention method. FlashAttention trains Transformers faster than existing baselines: 15% end-to-end wall-clock speedup on BERT-large (seq. length 512) compared to MLPerf 1.1, 3x speedup on GPT-2 (seq. length 1K), and 2.4x speedup on long-range arena (seq. length 1K-4K).

1 Introduction & Motivation
Most research in deep learning has focused on FLOP complexity (floating point operations), treating FLOPs as the primary proxy for execution time. However, on modern GPUs (e.g., NVIDIA A100), compute throughput has scaled much faster than memory bandwidth. Consequently, many operations are memory-bound: execution time is dominated by reading and writing tensors between High Bandwidth Memory (HBM) and Fast On-Chip SRAM (Static Random-Access Memory), rather than raw math operations.
Standard attention computes:
S = Q * K^T, P = softmax(S), O = P * V.
Standard implementations materialize intermediate matrices S and P of size N x N in HBM, requiring O(N^2) memory reads and writes, where N is the sequence length.

2 Methodology: IO-Aware Tiling
FlashAttention computes exact softmax without materializing the full N x N attention matrix in slow HBM.
Tiling: We split inputs Q, K, and V into blocks of size B_c and B_r, loading them from HBM to SRAM, computing attention with respect to that block, and accumulating the output.
Online Softmax: Because softmax requires computing row-wise maxima and sums over all keys, standard tiling would fail. We employ online softmax (Milakov & Gimelshein, 2018), maintaining running scaling factors m(x) and l(x) to incrementally normalize attention outputs block-by-block in fast SRAM without ever materializing intermediate NxN attention weights in HBM.
Recomputation in Backward Pass: Rather than storing the N x N attention matrix P in HBM for backpropagation (which consumes enormous memory), FlashAttention recomputes attention blocks on-the-fly from Q, K, V stored in SRAM during the backward pass.

3 Empirical Results
- Speedup: FlashAttention yields 2x to 4x wall-clock speedup in attention runtime across sequence lengths from 512 to 4096.
- End-to-end Model Speedup: 3x faster training for GPT-2 (1K sequence length); 2.4x faster on Long Range Arena (seq length 1K to 4K).
- Memory Footprint: Memory complexity scales linearly O(N) in sequence length instead of quadratic O(N^2), allowing BERT and GPT models to train with context lengths up to 64K tokens on a single GPU.
- Quality: Exact attention preserves model accuracy identically; unlike approximate attention methods, there is zero degradation in perplexity or task performance.

4 Limitations
FlashAttention is implemented as custom CUDA / Triton kernels finely tuned to the memory hierarchy of specific GPU hardware (specifically NVIDIA Ampere, Hopper, and Ada architectures). Writing and maintaining these kernels requires low-level GPU programming knowledge. Additionally, the maximum achievable speedup diminishes when sequence length is very short (e.g. N < 128) where memory bandwidth is not the primary bottleneck and kernel launch overheads become visible.`,
    cachedAnalysis: {
      id: 'flash-attention-analysis',
      title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
      authors: ['Tri Dao', 'Daniel Y. Fu', 'Stefano Ermon', 'Atri Rudra', 'Christopher Ré'],
      year: '2022',
      venue: 'NeurIPS 2022',
      objective: 'Eliminate the memory-bandwidth bottleneck of standard self-attention by designing an IO-aware algorithm that minimizes data movement between GPU high-bandwidth memory (HBM) and on-chip SRAM without approximating attention scores.',
      methodology: {
        summary: 'Leverages tiling and online softmax to compute exact attention block-by-block entirely within high-speed GPU SRAM, recomputing intermediate matrices during the backward pass rather than saving N x N attention tensors to HBM.',
        coreTechniques: [
          'Tiling: Partitioning Q, K, V matrices into SRAM-sized blocks',
          'Online Softmax: Incremental normalization across blocks via running max and sum',
          'Selective Activation Recomputation in backward pass',
          'Hardware-level IO-awareness accounting for HBM-SRAM transfer overhead'
        ],
        datasets: ['Long Range Arena (LRA)', 'BERT-large (seq len 512)', 'GPT-2 (seq len 1K-4K)'],
        hardwareOrCompute: 'Custom CUDA kernels evaluated on NVIDIA A100 GPUs'
      },
      findings: [
        {
          metricOrDiscovery: '3x wall-clock training speedup on GPT-2',
          detail: 'Tripled training throughput on GPT-2 with 1K sequence length compared to standard PyTorch implementation.'
        },
        {
          metricOrDiscovery: 'Linear O(N) memory scaling',
          detail: 'Avoided materializing the O(N^2) attention matrix in HBM, unlocking context lengths up to 64K tokens.'
        },
        {
          metricOrDiscovery: 'Zero accuracy loss (Exact Attention)',
          detail: 'Unlike heuristic or approximate attention, mathematically computes exact attention with identical numerical outputs.'
        }
      ],
      limitations: {
        isMentioned: true,
        text: 'Custom CUDA/Triton kernels are tightly coupled to specific GPU hardware architectures (NVIDIA Ampere/Hopper). Diminishing returns on very short sequences (N < 128) where kernel launch latency dominates.'
      },
      keyTakeaways: [
        'Deep learning performance on modern accelerators is often IO/memory-bound rather than compute/FLOP-bound.',
        'Online softmax and activation recomputation enable exact O(N) memory scaling without quality trade-offs.',
        'Foundation for all modern long-context LLM infrastructure (FlashAttention-2/3, vLLM).'
      ],
      citation: {
        title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
        authors: ['Tri Dao', 'Daniel Y. Fu', 'Stefano Ermon', 'Atri Rudra', 'Christopher Ré'],
        year: '2022',
        venue: 'Advances in Neural Information Processing Systems 35 (NeurIPS)',
        bibtex: `@inproceedings{dao2022flashattention,
  author    = {Dao, Tri and Fu, Daniel Y. and Ermon, Stefano and Rudra, Atri and R{\\'e}, Christopher},
  title     = {{FlashAttention}: Fast and Memory-Efficient Exact Attention with {IO}-Awareness},
  booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
  year      = {2022}
}`,
        apa: 'Dao, T., Fu, D. Y., Ermon, S., Rudra, A., & Ré, C. (2022). FlashAttention: Fast and memory-efficient exact attention with IO-awareness. Advances in Neural Information Processing Systems, 35, 16344–16359.'
      },
      markdown: `# Research Paper Analysis

## 🎯 Objective
Overcome the quadratic time and memory limitations of standard Transformer attention on long sequences by addressing the memory bandwidth (IO) bottleneck between GPU High Bandwidth Memory (HBM) and fast on-chip SRAM.

## ⚙️ Methodology
- **IO-Aware Formulation**: Models GPU execution time based on memory transfer costs rather than arithmetic FLOPs.
- **Tiling**: Decomposes Q, K, and V into blocks that fit within fast on-chip SRAM (Static RAM).
- **Online Softmax**: Computes exact softmax incrementally across blocks using running maximum and sum scalers without storing the full N x N matrix in HBM.
- **Backward Recomputation**: Recomputes attention weights on-the-fly in SRAM during backpropagation instead of loading massive intermediate activation tensors from HBM.
- **Hardware Target**: Optimized CUDA kernels for NVIDIA A100 architectures.

## 📊 Findings
- Delivered **2x to 4x** speedup in isolated attention computation and **3x** end-to-end wall-clock training speedup for GPT-2 (1K context).
- Reduced memory footprint from quadratic O(N^2) to **linear O(N)**, enabling context windows up to 64K tokens on single GPUs.
- Achieved **zero accuracy degradation** compared to approximate attention baselines by preserving mathematically exact attention weights.

## ⚠️️ Limitations
The algorithm requires low-level hardware-tailored CUDA/Triton kernels specific to GPU memory hierarchies (NVIDIA Ampere/Hopper). Wall-clock benefits decline sharply for short sequence lengths (N < 128) where memory bandwidth is not the primary performance bottleneck.

## 💡 Key Takeaways
- Algorithm design must account for hardware memory hierarchies (HBM vs SRAM) rather than just theoretical FLOP counts.
- Exact attention can scale linearly in memory through online streaming operators.
- Catalyst for current multi-million token context window architectures in frontier models.`,
      sourceText: '',
      analyzedAt: 1718000000000,
      sourceType: 'sample'
    }
  },
  {
    id: 'resnet-deep-residual-learning',
    title: 'Deep Residual Learning for Image Recognition',
    authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
    year: '2015',
    category: 'Computer Vision / Architecture',
    description: 'Solves the degradation problem in ultra-deep neural networks by reformulating layers as learning residual functions with skip connections.',
    text: `Deep Residual Learning for Image Recognition

Abstract
Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth. On the ImageNet dataset we evaluate residual nets with a depth of up to 152 layers---8x deeper than VGG nets but still having lower complexity. An ensemble of these residual nets achieves 3.57% error on the ImageNet test set. This result won the 1st place on the ILSVRC 2015 classification task. We also present analysis on CIFAR-10 with 100 and 1000 layers.
Overcoming degradation: When deeper networks start converging, a degradation problem has been exposed: with network depth increasing, accuracy gets saturated and then degrades rapidly. Unexpectedly, such degradation is not caused by overfitting, and adding more layers to a suitably deep model leads to higher training error.

Methodology & Formulation
Let H(x) be an underlying mapping to be fit by a few stacked layers, with x denoting the inputs to the first of these layers. Rather than expecting stacked layers to approximate H(x), we explicitly let these layers approximate a residual function:
F(x) := H(x) - x
The original mapping is recast into:
F(x) + x
We hypothesize that it is easier to optimize the residual mapping than to optimize the original, unreferenced mapping. The formulation of F(x) + x can be realized by feedforward neural networks with "shortcut connections" (or skip connections). Shortcut connections simply perform identity mapping, and their outputs are added to the outputs of the stacked layers. Identity shortcut connections introduce neither extra parameter nor computation complexity.
Network Architectures:
- ResNet-34, ResNet-50, ResNet-101, and ResNet-152.
- Bottleneck design: For deeper nets (ResNet-50/101/152), each residual block uses a 3-layer stack: 1x1, 3x3, and 1x1 convolutions, where the 1x1 layers reduce and then restore dimensions.
- Batch Normalization is adopted right after each convolution and before activation.

Results & Findings
- ImageNet Classification: ResNet-152 achieved 4.49% top-5 error (single model) and 3.57% top-5 error (ensemble), winning ILSVRC 2015.
- Overcame degradation: 34-layer ResNet has 2.8% lower training error than 18-layer ResNet, whereas 34-layer plain net had higher training error than 18-layer plain net.
- Successful training of 1000-layer networks on CIFAR-10 with smooth convergence.
- Won 1st place in 5 major ILSVRC & COCO 2015 competitions (ImageNet classification, ImageNet detection, ImageNet localization, COCO detection, COCO segmentation).

Limitations
Not explicitly mentioned in the text.`,
    cachedAnalysis: {
      id: 'resnet-deep-residual-learning-analysis',
      title: 'Deep Residual Learning for Image Recognition',
      authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
      year: '2015',
      venue: 'CVPR 2016',
      objective: 'Overcome the optimization degradation problem in ultra-deep neural networks where increasing network depth leads to higher training error despite avoiding vanishing gradients.',
      methodology: {
        summary: 'Reformulates layer objectives to learn residual mapping F(x) = H(x) - x via parameter-free identity shortcut connections, enabling direct gradient propagation across 100+ layers.',
        coreTechniques: [
          'Identity Shortcut (Skip) Connections: y = F(x, {W_i}) + x',
          'Residual formulation easing identity mapping optimization',
          'Bottleneck architecture (1x1, 3x3, 1x1 convs) for compute efficiency',
          'Batch Normalization after each convolution layer'
        ],
        datasets: ['ImageNet 2012 (1000 classes, 1.28M images)', 'CIFAR-10', 'MS COCO'],
        hardwareOrCompute: '8-GPU training cluster utilizing SGD with momentum 0.9'
      },
      findings: [
        {
          metricOrDiscovery: '3.57% top-5 error on ImageNet',
          detail: 'Ensemble of ResNets won 1st place in ILSVRC 2015 classification, surpassing human-level performance.'
        },
        {
          metricOrDiscovery: 'Depth scaling up to 152 layers',
          detail: 'Successfully optimized networks 8x deeper than VGG while maintaining lower computational complexity.'
        },
        {
          metricOrDiscovery: 'Swept 5 competitive computer vision tracks',
          detail: 'Won 1st place across ILSVRC classification, detection, localization, and COCO detection and segmentation.'
        }
      ],
      limitations: {
        isMentioned: false,
        text: 'Not explicitly mentioned in the text.'
      },
      keyTakeaways: [
        'Identity skip connections allow gradients to flow directly through deep stacks without attenuation.',
        'Learning residual functions F(x) = 0 is fundamentally easier for optimizers than learning unreferenced identity mappings.',
        'Established the skip-connection paradigm used across modern convolutional and transformer architectures.'
      ],
      citation: {
        title: 'Deep Residual Learning for Image Recognition',
        authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
        year: '2015',
        venue: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
        bibtex: `@inproceedings{he2016deep,
  author    = {He, Kaiming and Zhang, Xiangyu and Ren, Shaoqing and Sun, Jian},
  title     = {Deep Residual Learning for Image Recognition},
  booktitle = {IEEE Conference on Computer Vision and Pattern Recognition (CVPR)},
  year      = {2016}
}`,
        apa: 'He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 770–778).'
      },
      markdown: `# Research Paper Analysis

## 🎯 Objective
Solve the degradation problem in very deep neural networks, where adding layers causes training error to increase rather than decrease, by creating an architecture that is readily optimizable at extreme depths.

## ⚙️ Methodology
- **Residual Formulation**: Fits residual mapping F(x) := H(x) - x instead of original target H(x), yielding output H(x) = F(x) + x.
- **Identity Shortcuts**: Implements parameter-free identity skip connections that add input x directly to the output of stacked convolutional layers.
- **Bottleneck Blocks**: Uses 1x1, 3x3, and 1x1 convolutions in deeper variants (ResNet-50/101/152) to control dimensional FLOPs.
- **Normalization**: Systematically applies Batch Normalization directly after convolutions prior to ReLU activations.
- **Datasets**: ImageNet 2012 classification, CIFAR-10, and MS COCO.

## 📊 Findings
- **3.57% top-5 error** on ImageNet test set with ResNet ensemble, winning ILSVRC 2015.
- ResNet-152 achieved lower FLOP complexity than 19-layer VGG despite being 8x deeper.
- Reversed degradation: 34-layer ResNet achieved 2.8% lower training error than 18-layer ResNet.
- Successfully trained experimental networks up to 1,000 layers on CIFAR-10 with stable convergence.

## ⚠️️ Limitations
Not explicitly mentioned in the text.

## 💡 Key Takeaways
- Residual connections ensure that deep networks can at minimum perform as well as shallower counterparts by defaulting to identity transformations.
- Direct error propagation via shortcuts resolves vanishing/exploding gradients during backpropagation.
- Skip connections became a foundational component in modern deep learning architectures, including Transformers and Diffusion models.`,
      sourceText: '',
      analyzedAt: 1718000000000,
      sourceType: 'sample'
    }
  }
];
