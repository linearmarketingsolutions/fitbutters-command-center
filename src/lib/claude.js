const BASE_URL = "https://api.anthropic.com/v1/messages"
const MODEL = "claude-sonnet-4-20250514"

export async function callClaude({ system, prompt, onStream }) {
  const key = sessionStorage.getItem('fb_api_key')
  if (!key) throw new Error('No API key')
  const body = {
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
    ...(system && { system }),
    ...(onStream && { stream: true })
  }
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`)
  if (onStream) {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = line.slice(6)
            if (json === '[DONE]') continue
            const data = JSON.parse(json)
            if (data.type === 'content_block_delta' && data.delta?.text) {
              onStream(data.delta.text)
            }
          } catch (_) {}
        }
      }
    }
  } else {
    const data = await res.json()
    return data.content[0].text
  }
}
