const BRAND_CONTEXT = `Fit Butters is a premium protein nut butter brand. Founded March 2020 by Ryan and Danielle Bucki in Minneapolis, MN. Tagline: "The Treat Without The Cheat™". Secondary: "#MORE FLAVOR. LESS GIMMICKS."
Licensed brand collaborations: Reese's, Oreo, Twix, Fruity PEBBLES, Cocoa PEBBLES, M&Ms, Ghirardelli, Jet-Puffed. 4,000+ retail doors including Walmart (1,300 stores), Publix, Kroger, GNC (750+), Vitamin Shoppe (720), Meijer, Wegmans. Also on fitbutters.com (Shopify), Amazon, TikTok Shop. Price $14.99–$16.99 per 16oz jar. ~7–10g protein per serving. Fit Fam influencer program: up to 20% commission, up to 50% personal discount, free product for monthly goals.
Tone: Confident, direct, playful but not juvenile. Short sentences. Active voice. Fitness-aware but not gatekeepy. Never corporate or stuffy. No filler phrases like "We're so excited to..." or "We'd love to connect..."`

export function influencerOutreachPrompt({ creatorName, platform, followerCount, niche, flavorTags }) {
  const flavors = Array.isArray(flavorTags) ? flavorTags.join(', ') : String(flavorTags || '')
  return `${BRAND_CONTEXT}

Generate an influencer outreach package for this creator. Return ONLY valid JSON with exactly these keys, no other text:

{
  "discountCode": "CODE20",
  "discountPercent": 20,
  "emailSubject": "Creator name + Fit Butters partnership subject line",
  "emailBody": "Full outreach email body, 3-4 short paragraphs. Personalized. Direct. Include the discount code. End with clear CTA.",
  "contentBrief": ["Bullet 1: Key message or angle", "Bullet 2: Content idea", "Bullet 3: Call to action or CTA"]
}

Creator: ${sanitize(creatorName)}
Platform: ${sanitize(platform)}
Follower count: ${sanitize(followerCount)}
Niche: ${sanitize(niche)}
Suggested flavors to feature: ${sanitize(flavors)}

Return only the JSON object.`
}

export function socialCaptionPrompt({ topic, platform, vibe }) {
  return `${BRAND_CONTEXT}

Generate 5 distinct social media captions for Fit Butters. Return ONLY valid JSON with exactly this structure, no other text:

{
  "captions": [
    {"text": "Caption body...", "hashtags": ["#hashtag1", "#hashtag2"]},
    {"text": "Caption body...", "hashtags": ["#hashtag1", "#hashtag2"]},
    {"text": "Caption body...", "hashtags": ["#hashtag1", "#hashtag2"]},
    {"text": "Caption body...", "hashtags": ["#hashtag1", "#hashtag2"]},
    {"text": "Caption body...", "hashtags": ["#hashtag1", "#hashtag2"]}
  ]
}

Topic: ${sanitize(topic)}
Platform: ${sanitize(platform)}
Vibe: ${sanitize(vibe)}

Each caption should be unique in angle and length. Hashtags appropriate for the platform. Return only the JSON object.`
}

export function supportBotSystemPrompt() {
  return `You are the Fit Butters customer support assistant. Answer questions accurately using only this company knowledge:

Founded: March 2020
Founders: Ryan Bucki (CEO) + Danielle Bucki (President)
HQ: Minneapolis, MN
Manufacturing: GMP/FDA-approved facility, Northeast Minneapolis
Retail doors: 4,000+
Retailers: Walmart (~1,300 stores), Publix, Kroger, GNC (750+), Vitamin Shoppe (720), Meijer (~500), Wegmans, Hy-Vee, Giant Eagle
Online: fitbutters.com (Shopify), Amazon, TikTok Shop
International: UK via Predator Nutrition
Price: $14.99–$16.99 per 16oz jar
Protein: ~7–10g per serving (2 tbsp)
Tagline: "The Treat Without The Cheat™"
Secondary: "#MORE FLAVOR. LESS GIMMICKS."
VIP Club: 15% off first order, early drop access
Fit Fam Influencer Program: up to 20% commission, up to 50% personal discount, free product for monthly goals
Ambassador Program: currently paused / transitioning platforms
Licensed flavors: Reese's, Oreo, Twix, Fruity PEBBLES, Cocoa PEBBLES, M&Ms, Ghirardelli, Jet-Puffed

Be helpful, friendly, and concise. If you don't know something, say so. Never make up information.`
}

function sanitize(str) {
  if (str == null || str === '') return ''
  return String(str)
    .replace(/[<>\"'`]/g, '')
    .slice(0, 500)
}
