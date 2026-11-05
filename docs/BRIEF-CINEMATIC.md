# Northstar — Cinematic Brief (from Kevin Singh, Nov 4 2026)

Lead-in from Kevin: "The website uses video and website elements in tune and positioned accordingly to create a harmonized scroll-based storytelling website. To carry the same style through to the end of the page we must expand the video."

Approved content: docs/CONTENT-APPROVED.pdf (and .md). Every item must appear word for word.

## 1. NON-NEGOTIABLE: DO NOT TURN THIS INTO A CINEMATIC INTRO FOLLOWED BY A CONVENTIONAL WEBSITE

The website must remain one continuous cinematic experience from the Northstar logo animation to the final contact screen. This has been part of the original vision from the beginning and must not be compromised.

Not wanted:
- A logo animation followed by a cinematic drone sequence.
- A few cinematic sequences introducing the robots.
- The cinematic ending after the product introductions.
- A transition into conventional Technology, Solutions, Industries, About Us and Contact website sections.

Do not interpret the requirement as simply placing a video behind conventional website sections. The cinematic is the website itself. Products, their information, applications, the platform demonstration, the brand story and the contact information must all be presented within that continuous cinematic experience.

### Required architecture
One persistent, full-screen cinematic stage throughout the complete visitor journey:
1. The Northstar logo animation transitions into the cinematic.
2. The drone enters and introduces its capabilities.
3. The drone exits naturally, leading into the humanoid sequence.
4. The humanoid introduces its capabilities and applications.
5. The humanoid transitions naturally into the quadruped sequence.
6. The quadruped introduces its capabilities and applications.
7. The physical robotics environment transitions into the Northstar Platform.
8. The Platform appears as an interactive foreground interface within the cinematic.
9. The Vision chapter communicates the complete Northstar ecosystem.
10. The final Contact chapter concludes the cinematic journey.

Solutions, Industries, technical specifications, product information, About Us and other existing content must be incorporated into these scenes. No separate conventional website sections after the cinematic product introduction.

### How the information must be integrated
Contextual foreground elements over the cinematic: connecting lines originating from the actual products; product identification labels; compact information panels; expandable technical-information overlays; contextual application descriptions; minimal HUD-inspired indicators; interactive elements where required.
When more information is needed, add more information-reveal states within the same journey. Do not solve information density with separate static pages or conventional content sections. E.g. the drone has multiple information-reveal moments covering its complete product information; same for humanoid and quadruped. The Platform stays an interactive component inside the stage. Vision and Contact are part of the same experience.

### Mandatory architectural restrictions (not acceptable)
- Ending the cinematic after the quadruped and introducing a conventional website below.
- Separate full-screen static sections for Technology, Solutions, Industries or About Us.
- Reintroducing conventional image-and-text layouts.
- Standalone product cards or feature grids to accommodate missing information.
- A fixed cinematic hero followed by ordinary scrollable sections.
- Each product as a separate video section with an unrelated background.
- Platform, Vision or Contact as separate conventional pages disconnected from the cinematic.

Use a persistent cinematic stage with a scroll-controlled narrative timeline and foreground content layers. Keep native scrolling responsive and natural. The cinematic must remain present and relevant throughout the entire page. This is a core acceptance requirement.

## 2. DEVICE MOVEMENT AND CINEMATIC CONTINUITY
Fix at the source-footage and animation levels.

A. Drone: consistent body orientation relative to flight direction; gradual turns, not sudden direction changes; yaw and banking before turns; camera follows the drone's actual movement; no abrupt changes in screen position or perspective; realistic flight speed. Never travel one way while facing another without a visible turn.

B. Humanoid: consistent walking direction and orientation. When turning: feet pivot, torso follows, head and body settle into the new direction; camera synchronized. Do not join clips with inconsistent walking directions.

C. Quadruped: consistent orientation; complete turning movements; leg movement matches direction of travel; no sudden forward-facing to backward-facing shots; consistent camera tracking.

D. Natural product exits (currently they accelerate suddenly or sprint out of frame). Every product's departure:
1. Completes its current movement or information reveal.
2. Resumes movement at a natural speed.
3. Gradually approaches its destination.
4. Decelerates or adjusts direction where needed.
5. Camera follows.
6. Moves behind a physical object, through an entrance or into the distance.
7. Camera continues the movement.
8. The next environment becomes visible naturally.
Do not simply animate the product out of the viewport, do not accelerate playback to force an exit, do not abandon camera movement before the departure completes.

## 3. DRONE PROPELLERS – CONTINUOUS MECHANICAL MOVEMENT
Propellers currently stop during flight then restart. During hovering and info-reveal states: position stable; all propellers keep rotating; consistent rotor motion and blur; never look powered off while airborne. Do not freeze the whole video on a still frame while hovering. Separate continuous mechanical movement from scroll-controlled movement: a continuously playing hover sequence or an independently controlled propeller animation/composited layer. Apply the same to subtle idle movement in the humanoid and quadruped.

## 4. INDUSTRIAL ENTRANCE AND SHUTTER – VISUAL INCONSISTENCY
The exterior shot establishes an overhead, horizontally slatted roller shutter opening vertically; the next shot introduces doors closing from left and right, which then open again during the camera move. Fix:
1. Keep the overhead roller shutter from the exterior shot.
2. It opens vertically.
3. Never closes from left/right.
4. Sufficiently open before the camera approaches.
5. Stays open while the camera moves through.
6. Consistent entrance dimensions, walls and architecture.
7. Remove the left-right door animation entirely.
8. No other open/close animation during the zoom.
Reduce the excessive smoke/fog so the building and doorway stay clearly visible.

## 5. SCROLL PERFORMANCE – FIX THE UNDERLYING BUGS
Scrolling is laggy, sometimes stops responding, and doesn't consistently sync with the cinematic. Do not fix by reducing sensitivity, adding delays or making the visitor scroll faster. Investigate: multiple competing ScrollTrigger instances; duplicate scroll controllers; repeated video currentTime updates; video seeking during raw scroll events; excessive simultaneous decoding; large inefficient video files; multiple pinned sections with conflicting spacers; excessive React state updates; heavy backdrop filters and compositing; conflicting smooth-scroll libraries; incorrect ScrollTrigger refresh logic; unnecessary DOM calculations.

Required:
1. One authoritative scroll controller for the complete cinematic.
2. Persistent cinematic stage throughout.
3. GSAP ScrollTrigger controls the narrative timeline.
4. Animation and video-seeking via requestAnimationFrame.
5. Only the active scene actively seeking where possible.
6. Preload the immediate next scene.
7. Don't load all videos at once.
8. No unnecessary video reloads when moving backwards.
9. No competing pin and snap behaviours.
10. Native scrolling responsiveness.
Video playback, info animations or platform interactions must never block scroll input. Profile with browser performance tools and verify improvements.

## 6. INFORMATION PRESERVATION – ABSOLUTELY NO CONTENT REDUCTION
Change presentation only, never the amount of information. Before content changes, create a complete content inventory from the original approved content. Preserve:
- Drone: full descriptions, specs, features, capabilities, workflows, applications.
- Humanoid: complete descriptions, technical details, features, capabilities, use cases, differentiators.
- Quadruped: complete descriptions, specs, inspection capabilities, applications, use cases.
- Northstar Platform: all software features, modules, functions, AI capabilities, differentiators.
- Solutions: all categories, descriptions and supporting information.
- Industries: all categories and applications.
- About: company info, mission, vision, approved brand messaging.
- Contact: details, enquiry info, legal info, form functionality.

Distribute across multiple cinematic stopping points. E.g. the drone journey: 1 introduction and purpose; 2 technical capabilities; 3 core features; 4 inspection workflows; 5 applications and use cases; 6 additional specs. Same for humanoid and quadruped with their approved info. Progressive contextual panels; expandable overlays for longer explanations. Platform can hold a more extensive interactive interface. Complete info accessible without redirecting to a conventional section.

Content audit: a mapping document with columns — Original approved content | Current implementation | Missing information | Reduced or modified information | Cinematic chapter | Exact panel or overlay. Every item accounted for. 100% retained. Do not invent capabilities or specs.

## 7. PRODUCT INFORMATION REVEAL – REQUIRED BEHAVIOUR
One system for all three products:
PRODUCT MOVES → DECELERATES → STOPS → VISUAL INDICATOR APPEARS → CONNECTING LINE EXTENDS → INFORMATION PANEL APPEARS → SCENE HOLDS → INFORMATION DISAPPEARS → PRODUCT RESUMES MOVEMENT.
Keep the existing dark translucent panel design and connecting lines. Panels appear only after the product stops; contain the full relevant info for that stage; product stays fully visible; text readable; longer info via expandable overlays; don't repeat the same info at every stop. No info while the subject moves rapidly; never leave a product standing in an empty environment without relevant info.

## 8. QUADRUPED SEQUENCE – RESTORE THE MISSING INFORMATION
There's a long stationary period without enough info. At least two quadruped reveal states from approved content: first = primary inspection capabilities; second = remaining features, specs or applications. Same line-and-panel system. No separate quadruped page or static section.

## 9. NORTHSTAR PLATFORM – RETAIN THE CURRENT DESIGN
Keep the existing interface, scanning-line transition, layout, typography and palette. Complete:
- Quadruped visibly completes its inspection before the data transition.
- Scanning effect emerges from the physical inspection environment, then transitions into the platform map and inspection info.
- Interface reads as the digital extension of the robotics ecosystem.
- Site selectors, map markers, 3D Model, Compare, Reports and flagged issues all work.
- Cinematic holds during platform interaction; no animation interference.
- Scrolling past the platform resumes the cinematic naturally.
Don't replace the dashboard with a conventional section. Use actual data where available; clearly label illustrative data.

## 10. VISION AND CONTACT – REMAIN WITHIN THE CINEMATIC
Vision currently repeats the drone construction footage with an oversized headline. Replace with an ecosystem-wide sequence:
1. Wide industrial ecosystem establishing shot.
2. Drone operating in its environment.
3. Humanoid performing industrial operations.
4. Quadruped performing its inspection.
5. Platform receiving and presenting information from the ecosystem.
6. Final wide composition of the connected ecosystem.
Consistent grading and camera movement. Approved mission/vision copy. One strong headline (max 2–3 lines), one concise supporting paragraph, extra approved info via a secondary overlay if needed. No static mission/vision cards or conventional text sections.

Contact: keep the composition — left headline and supporting text; right contact form; cinematic industrial background; dark readable overlay; compact footer. Use a distinct closing environment, not the humanoid factory footage. Verify form validation, submission, success/error feedback and all links. Footer stays inside the final stage; no separate conventional footer.

## 11. ADDITIONAL VISUAL AND EXPERIENCE CORRECTIONS
A. Opening drone reveal: start with a wide environmental shot and introduce the drone; don't start with the drone filling the frame.
B. Humanoid framing: full humanoid visible during the main walk; fix the extreme close-up at the end.
C. Empty corridor: reduce empty corridor footage between humanoid and quadruped; always a clear subject or destination.
D. Quadruped-to-platform: show the quadruped's departure before the data-scanning sequence; no abrupt switch from indoor quadruped to an unrelated outdoor shot.
E. Platform loading: don't leave Flagged Issues blank; show a skeleton or the initial selected issue.
F. Vision transition: remove the ghosted/translucent duplicate of the Platform over later footage; the platform exits cleanly before Vision.
G. Footer and chapter navigation: reposition the chapter indicator and footer info so they don't compete for space; keep all navigation working.

## 12. REQUIRED SCROLL AND VIDEO TESTING
Test as one complete timeline.
Forward: drone moves naturally and shows all info; humanoid follows the same move-and-info sequence; quadruped likewise; Platform appears and is interactive; Vision and Contact complete the cinematic.
Backward: previous scenes restore correctly; panels at original positions; movement reverses where supported; no unnecessary video reloads; no unexpected reset.
Performance: no scroll freezing, sudden jumps, repeated stuttering, unnecessary decoding, conflicting scroll animations; stable Platform interaction.

## 13. IMPLEMENTATION PROCESS (in order)
1. Audit before modification: content-preservation audit; video-asset and continuity audit; scroll-performance diagnosis; list of components to correct.
2. Correct the source footage and sequences (movement, turns, exits, propellers, shutter, continuity). Identify footage to replace with exact replacement requirements.
3. Correct the animation and scrolling architecture without simplifying the continuous cinematic.
4. Restore the complete information, mapped to scenes and reveal states.
5. Complete Platform, Vision and Contact, keeping existing visual designs.
6. Test the entire site from logo to Contact. Don't mark sections complete without verifying the full experience.

## 14. FINAL ACCEPTANCE CRITERIA
Architecture: one persistent stage throughout; no conventional sections after the product intro; Solutions and Industries integrated into product journeys; Vision and Contact inside the cinematic; the cinematic doesn't end before Contact.
Movement: physically consistent drone; propellers rotate continuously in flight and hover; natural turns for all three; all three decelerate and exit naturally; consistent entrance and overhead shutter; no abrupt scene replacement or unexplained disappearance.
Content: all approved product info, specs, features and capabilities; solutions and industries preserved; platform info and functions preserved; nothing deleted or reduced for the cinematic.
Performance: responsive, consistent scrolling; no unexpected freezes; no black frames between videos; forward and backward work; platform interaction doesn't interfere with scrolling.
Final chapters: natural, fully interactive Platform transition; Vision communicates the whole ecosystem; Contact inside the cinematic; footer and navigation work.

## 15. COMPLETION REPORT
1. All files and components modified. 2. Cinematic sequences corrected. 3. Footage reused and footage needing replacement. 4. Content audited and restored. 5. Platform interactions tested. 6. Scroll-performance issues found and resolved. 7. Forward and backward test results. 8. Desktop, tablet and mobile results. 9. Remaining external asset dependencies.
Do not claim missing footage was corrected through frontend animation. Do not claim content is preserved without checking against the approved material. Do not mark functionality complete without testing.

## FINAL AND MOST IMPORTANT INSTRUCTION
DO NOT CREATE A CINEMATIC INTRODUCTION FOLLOWED BY A CONVENTIONAL WEBSITE. Do not revert to the previous architecture under any circumstances.

Journey: NORTHSTAR BRAND → DRONE → DRONE CAPABILITIES → HUMANOID → HUMANOID CAPABILITIES → QUADRUPED → QUADRUPED CAPABILITIES → NORTHSTAR PLATFORM → SOLUTIONS & INDUSTRIES → NORTHSTAR VISION → CONTACT.

All information must remain available; only presentation changes. The cinematic is the permanent visual foundation; products are the central subjects; the camera guides the journey; information appears contextually; the platform is interactive; the final chapters communicate the brand and generate enquiries. Don't replace this with static sections, cards or a conventional layout because they are easier.

If a video asset is missing or can't support a required transition, identify that exact dependency and request replacement footage. Don't use it as a reason to abandon the cinematic architecture or fall back to a conventional section.
