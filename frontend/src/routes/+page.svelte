<script lang="ts">
  import { onMount, tick } from "svelte";
  import { sendMessage } from "$lib/api";

  type Msg = { sender: "user" | "ai"; text: string };

  let messages: Msg[] = [];
  let input = "";
  let loading = false;
  let sessionId: string | null = null;
  let messagesEnd: HTMLDivElement;

  onMount(() => {
    sessionId = localStorage.getItem("sessionId");
  });

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userText = input;
    input = "";
    loading = true;

    messages = [...messages, { sender: "user", text: userText }];
    await tick();
    scrollToBottom();

    try {
      const res = await sendMessage(userText, sessionId || undefined);
      sessionId = res.sessionId;
      localStorage.setItem("sessionId", sessionId!);

      messages = [...messages, { sender: "ai", text: res.reply }];
    } catch {
      messages = [
        ...messages,
        { sender: "ai", text: "Something went wrong. Please try again." }
      ];
    } finally {
      loading = false;
      await tick();
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    messagesEnd?.scrollIntoView({ behavior: "smooth" });
  }
</script>

<div class="chat-wrapper">
  
  <header class="header">
    <div class="title">Spur AI Support</div>
    <div class="status">
      <span class="dot"></span> Online
    </div>
  </header>

  
  <div class="messages">
    {#if messages.length === 0}
      <div class="bubble ai intro">
        👋 Hi! I’m your AI support agent.<br />
        Ask me about shipping, returns, or anything else.
      </div>
    {/if}

    {#each messages as msg}
      <div class="bubble {msg.sender}">
        {msg.text}
      </div>
    {/each}

    {#if loading}
      <div class="bubble ai typing">Agent is typing…</div>
    {/if}

    <div bind:this={messagesEnd}></div>
  </div>


  <div class="input-box">
    <input
      bind:value={input}
      placeholder="Type your message…"
      on:keydown={(e) => e.key === "Enter" && handleSend()}
    />
    <button on:click={handleSend} disabled={loading}>
      Send
    </button>
  </div>
</div>

<style>
  :root {
    --primary: #4f46e5;
    --primary-soft: #eef2ff;
    --bg: #f6f7fb;
    --surface: #ffffff;
    --ai-bg: #ffffff;
    --border: #e6e8ef;
    --text-dark: #0f172a;
    --text-muted: #64748b;
  }

  :global(body) {
    background: linear-gradient(
      180deg,
      #f4f6fb 0%,
      #eef1f7 100%
    );
  }

  .chat-wrapper {
    max-width: 420px;
    height: 640px;
    margin: 48px auto;
    background: var(--surface);
    border-radius: 20px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 10px 25px rgba(15, 23, 42, 0.08),
      0 2px 8px rgba(15, 23, 42, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  }

  
  .header {
    padding: 16px 18px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-weight: 600;
    font-size: 15px;
    color: var(--text-dark);
  }

  .status {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
  }

  
  .messages {
    flex: 1;
    padding: 18px 16px;
    overflow-y: auto;
    background: #f8fafc;
  }

  .bubble {
    max-width: 78%;
    padding: 12px 14px;
    margin-bottom: 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.45;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  .bubble.user {
    background: var(--primary);
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 6px;
  }

  .bubble.ai {
    background: var(--ai-bg);
    color: var(--text-dark);
    border: 1px solid var(--border);
    border-bottom-left-radius: 6px;
  }

  .bubble.intro {
    background: var(--primary-soft);
    color: var(--text-muted);
    border: none;
    box-shadow: none;
  }

  .typing {
    font-style: italic;
    opacity: 0.6;
  }


  .input-box {
    display: flex;
    gap: 10px;
    padding: 14px 16px;
    background: var(--surface);
    border-top: 1px solid var(--border);
  }

  input {
    flex: 1;
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 14px;
    border: 1px solid var(--border);
    outline: none;
    background: #f8fafc;
  }

  input::placeholder {
    color: var(--text-muted);
  }

  input:focus {
    background: white;
    border-color: var(--primary);
  }

  button {
    padding: 12px 18px;
    border-radius: 14px;
    background: var(--primary);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
</style>
