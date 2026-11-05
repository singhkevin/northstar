# /v3 against the client's copy ("NORTHSTAR (1).pdf", 9 pages, 1,566 words)

Checked 5 Nov 2026. Method: every run of 5 consecutive client words is searched for in `site-v2/v3/index.html`; a word counts as used if it sits inside a matching run. It cannot match headings shorter than five words, so those were read by eye.

| Client section | Before | After |
|---|---|---|
| 01 Hero | 44% | 96% |
| 02 Vision | 37% | 98% |
| 03 Technology | 54% | 92% |
| 04 Platform | 96% | 96% |
| 05 How Northstar works | 0% | 99% |
| 06 Construction | 0% | 98% |
| 07 Industries | 82% | 82% |
| 08 Why Northstar | 0% | 99% |
| 09 About | 0% | 99% |
| 10 Final CTA | 80% | 88% |
| **All** | **40%** | **95%** |

What the last 5% is: section numbers and titles from the document itself ("04. The Northstar Platform"), headings under five words that the check cannot match (for example "Industrial Assets & Manufacturing", which is on the page as an industry tab heading), and the button label pair "[Explore Northstar] [Partner With Us]", which is on the page as two buttons.

Added in this pass (all words come from the PDF, extracted by script, not retyped): the hero's second beat (paragraph, the three-term line, both buttons), the missing Vision paragraphs, Technology's intro and each system's missing paragraph, "Meet Northstar Physical AI Platform.", and four new sections: How it works, Construction, Why Northstar, About.

Choices to confirm:
- Sections now follow the client's order: Technology, Platform (with the coordination dial), How it works, Construction, Industries, Why Northstar, About, Contact.
- Headings are sentence case (as v3 already was); the client's PDF is Title Case.
- Header links use the client's navigation: Platform, Technology, Solutions (Construction), Industries, About us.
- Pictures are the existing generated stills and loops from the film. No new spend.
