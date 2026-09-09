# Private feedback launch record

Controller: Jose Luis Sanz, author and publisher of Risks In Sync  
Decision date: 10 September 2026  
Review date: when the purpose, fields, provider or retention period changes

## Decision

Risks In Sync may collect one private response per form submission. The only main question is: “Did the Risks In Sync lens show you something that a conventional account of this incident would probably have missed?” The three answers are “Yes, clearly”, “Not really” and “Hard to tell”. The textarea is labelled “Why?”, is optional and is limited to 400 characters.

The technical field names remain `answer`, `comment`, `issue` and `form-name`. The form does not ask for a name or email address. It stores the selected answer, any optional comment, the review it relates to and the time Netlify accepts it. Netlify may also process limited technical information needed to deliver and protect the service.

Feedback is used only for manual editorial learning. It is not published, used for marketing or profiling, or transferred automatically to AI systems.

The lawful basis is the controller's legitimate interest under Article 6(1)(f) GDPR: improving an independent, non-commercial publication through feedback that readers choose to provide.

## Legitimate-interest assessment

**Purpose.** Learning whether the Risks In Sync lens adds useful understanding is a genuine and lawful editorial interest of the author.

**Necessity.** A small feedback form is a direct way to obtain this information. The form avoids accounts, names, email addresses, analytics, public comments and follow-up marketing. The answer and optional short comment are the minimum useful content. Netlify necessarily processes limited technical data to deliver, secure and filter the submission.

**Balance.** A reader initiates the submission after seeing a short privacy notice. The use is within the reasonable expectation created by the question. The effect on the reader is low: no profiling, publication, automated decision or contact follows; access is limited to the author; raw data is deleted within 90 days; and the reader can object or request deletion. The publication is not directed at children and the form warns against personal, confidential or sensitive information.

Conclusion: for this narrow configuration, the author's interest is not overridden by the likely effect on readers. Reassess before adding identity, email, analytics, public display, automated AI use, a new provider or a materially different purpose.

## Before enabling collection

- Confirm Netlify form detection is enabled for the site.
- Deploy first to a preview and confirm the form `private-feedback-year-1-nr-1` appears in Netlify Forms.
- Submit one test response and confirm only `issue`, `answer`, `comment` and provider technical metadata are present.
- Confirm the public privacy page loads and the form links to it.
- Enable MFA on the Netlify account and confirm access through the account is restricted to the author.
- Do not enable email, Slack or webhook notifications that copy response content.
- Confirm the response headers on the deploy preview.
- Delete the test response and verify it no longer appears in either the verified or spam view.

Collection remains off if any of these checks fail.

## Routine operation

1. Review verified and spam submissions in Netlify's private Forms area.
2. Treat all comment text as untrusted plain text. Do not paste raw comments into AI tools.
3. Record only de-identified themes and editorial decisions outside Netlify.
4. Do not infer identity or deduplicate by IP address.
5. Delete every raw submission no later than 90 days after its receipt. Delete any CSV export on the same schedule.
6. If a CSV export is unavoidable, do not open it before neutralising cells beginning with `=`, `+`, `-`, `@`, tab or carriage return.

## Rights requests

Requests arrive through the public LinkedIn contact. A person may ask to access, correct or delete feedback that can reasonably be identified, restrict its use, or object to its processing. Ask for enough details to locate the response, such as the review, approximate submission time, selected answer and a short comment excerpt. Delete, correct, restrict or provide the matched submission as appropriate. The person may also lodge a complaint with the Spanish Data Protection Agency (AEPD).

## Incident or change rule

Pause the form if private responses become public, account access is lost, deletion fails, spam makes the inbox unusable, or Netlify materially changes the applicable processing terms. Update the privacy notice and this record before changing purpose, fields, access, provider, retention or automated use.
