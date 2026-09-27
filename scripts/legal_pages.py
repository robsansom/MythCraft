"""Writes privacy/index.html and support/index.html for the MythCraft site.
Usage: python3 legal_pages.py <site-root> <contact-email>"""
import html, os, sys

root, EMAIL = sys.argv[1], sys.argv[2]
UPDATED = "27 September 2026"
MAIL = f'<a href="mailto:{EMAIL}">{EMAIL}</a>'


def page(slug, title, description, body):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | MythCraft</title>
  <meta name="description" content="{html.escape(description)}" />
  <link rel="icon" type="image/png" href="../assets/art/app-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body class="legal-page">

  <header class="nav scrolled" id="nav">
    <div class="nav-inner">
      <a class="nav-logo" href="../">
        <img src="../assets/art/app-icon.png" alt="MythCraft icon" />
        <span>MYTHCRAFT</span>
      </a>
      <nav class="nav-links">
        <a href="../#play">The Game</a>
        <a href="../#books">The Books</a>
        <a href="../privacy/"{' aria-current="page"' if slug == 'privacy' else ''}>Privacy</a>
        <a href="../support/"{' aria-current="page"' if slug == 'support' else ''}>Support</a>
      </nav>
      <div class="nav-actions">
        <a class="btn btn-gold btn-small" href="../#get">Get the Game</a>
      </div>
    </div>
  </header>

  <main class="legal">
    <div class="legal-inner">
{body}
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="../assets/art/app-icon.png" alt="MythCraft icon" />
        <span>MYTHCRAFT</span>
      </div>
      <p class="footer-legal">
        © 2026 MythCraft. All myths belong to everyone; this telling belongs to us.<br />
        Not affiliated with any Olympian, living or overthrown.
      </p>
      <nav class="footer-links">
        <a href="../">Home</a>
        <a href="../privacy/">Privacy</a>
        <a href="../support/">Support</a>
        <a href="mailto:{EMAIL}">Contact</a>
      </nav>
    </div>
  </footer>
</body>
</html>
"""


def sections(items):
    out = []
    for title, body in items:
        paras = "\n".join(f"        <p>{p}</p>" for p in body)
        out.append(f"      <section class=\"legal-section\">\n        <h2 class=\"slab-text\">{title}</h2>\n{paras}\n      </section>")
    return "\n".join(out)


PROMISES = [
    "No account. There is nothing to sign up to.",
    "No analytics. We don't measure how you play.",
    "No advertising, now or ever.",
    "No tracking across apps or websites.",
    "No selling data. Your saga is yours, not a product.",
    "No third-party analytics or advertising SDKs in the app.",
]

PRIVACY = [
    ("Who we are", [
        'MythCraft (the "App") is published by an independent developer based in the United Kingdom ("we", "us"). '
        "We are the controller of personal information you choose to send us, such as a support email. "
        f"For privacy questions, contact {MAIL}.",
    ]),
    ("The short version", [
        "The App has no MythCraft account and no developer-operated server. Your game progress is stored on your device "
        "and, if iCloud Sync is on, in your own private iCloud. We never receive it. "
        "The App has no advertising, cross-app tracking or third-party analytics. "
        "Support emails, website hosting logs and the information Apple provides to developers are described below.",
    ]),
    ("Your game progress and iCloud", [
        "Your discoveries, Codex, chapter progress, whispers and settings are stored on your device using Apple's standard storage frameworks.",
        "iCloud Sync is on by default and can be turned off in the App's Settings. While it is on, your progress is kept in the private "
        "database of your own iCloud account using Apple's CloudKit, so it can follow you to your other devices. A few small preferences, "
        "such as whether you've seen the introduction, may also be kept in iCloud key-value storage. Your private iCloud data is available "
        "to your Apple Account, not to us, and Apple processes it under Apple's own privacy terms.",
    ]),
    ("The Fates' narration (Apple Intelligence)", [
        "On devices that support Apple Intelligence, the App can use Apple's on-device language model to write short narration lines from "
        "the Fates. The model is given only game information, such as the chips on your board and recent combinations, never personal "
        "information. It runs entirely on your device: nothing is sent to us or to any third party. Where the model isn't available, "
        "the App simply goes without these lines.",
    ]),
    ("Purchases", [
        "Books are one-time purchases and Oracle whisper packs are consumable purchases, both sold through Apple's App Store using StoreKit. "
        "Apple processes payments and makes purchase and entitlement information available to the App so it can unlock what you bought. "
        "We never receive your payment-card details. Apple handles billing, refunds and taxes under the Apple Media Services Terms.",
    ]),
    ("Information available through Apple", [
        "Apple may provide developers with aggregated App Store sales, download and usage reports. If you have chosen to share analytics "
        "with app developers in iOS, Apple may also provide crash and diagnostic information. Apple controls the information it collects "
        "through the App Store, StoreKit, iCloud and device analytics under Apple's own privacy terms. We don't use this information to "
        "build advertising profiles or to track you across apps or websites.",
    ]),
    ("Website and support", [
        "This website is hosted by GitHub Pages. GitHub may process IP addresses, request details and security logs when the site is visited. "
        "The site loads its typefaces from Google Fonts, so Google receives your IP address and browser details when a page loads. "
        "It uses no analytics, advertising cookies or other third-party scripts. It remembers your language choice in your browser's "
        "local storage, which isn't sent anywhere.",
        "If you email support, our email provider processes your address, message and any attachments so we can read and answer it.",
    ]),
    ("Why we use support information and how long we keep it", [
        "We use support correspondence to answer your request, diagnose problems, prevent abuse and keep an appropriate record of the help "
        "given. Our lawful basis under UK GDPR is our legitimate interest in supporting and improving the App and, where relevant, taking "
        "steps connected with our contract with you. We keep support messages only as long as reasonably needed for those purposes, "
        "normally no longer than 24 months after the conversation closes, unless a longer period is required for a legal, security or "
        "accounting reason.",
    ]),
    ("Service providers and international transfers", [
        "Apple, GitHub, Google and our email provider process information under their own terms and may process it outside the United "
        "Kingdom. Where UK data-protection law applies to a transfer we make, we rely on an applicable adequacy decision or appropriate "
        "contractual safeguards. We don't permit these providers to use support correspondence for our advertising.",
    ]),
    ("Security", [
        "We use platform security features and take reasonable organisational measures appropriate to the limited information we handle. "
        "Device and iCloud security are provided primarily by Apple. No storage or transmission method is completely secure, so we "
        "cannot promise absolute security.",
    ]),
    ("Children", [
        "MythCraft is made for a general audience. It has no account, chat or social features, and it doesn't ask for your age or any "
        "personal information. If a child emails support, we use the message only to respond and manage the request, and a parent or "
        "guardian can contact us about that correspondence.",
    ]),
    ("Your rights", [
        "Depending on where you live, you may have rights over personal information we control, including rights to access, correct, "
        "erase, restrict or object to its use, and to complain to a regulator. These rights are subject to legal limits. "
        f"Contact {MAIL} to make a request. UK residents may complain to the Information Commissioner's Office at "
        '<a href="https://ico.org.uk">ico.org.uk</a>. Game progress stored only on your device or in your iCloud is managed through '
        "the App, your device or your Apple Account, because we don't hold a copy.",
    ]),
    ("Changes to this policy", [
        "We may update this policy when the App, website, providers or legal requirements change. We will update the date above and give "
        "additional notice where a change materially affects how we use personal information.",
    ]),
    ("Contact", [
        f"Questions or requests about privacy can be sent to {MAIL}. A postal address for formal correspondence is available on request.",
    ]),
]

FAQS = [
    ("How do I play?",
     "Drag one chip onto another. If the myth allows it, something new appears: Sky and Earth, Titans and gods, heroes and monsters. "
     "Each Book follows the saga in order, and every discovery is written into your Codex."),
    ("I'm stuck. How do hints work?",
     "Ask the Oracle. She whispers daily hints for free, rewards solved riddles, and takes pity on the truly lost, so play is never "
     "gated behind a hint. Bought whispers skip the riddling and name one of the two ingredients straight away. They keep until you use them."),
    ("What's free, and what do I buy?",
     "Chapter 1 is free and complete. Each Book is a one-time purchase that's yours for good, and there's a bundle for the whole of Greece. "
     "Oracle whisper packs are optional. Prices are shown in the App before you buy. There are no subscriptions and no ads."),
    ("Will my progress follow me to a new iPhone or iPad?",
     "Yes, if iCloud Sync is on (it is by default). Your progress syncs through your own iCloud to devices signed in to the same Apple Account. "
     "If you turn iCloud Sync off in Settings, progress stays on that device only, and deleting the App deletes it."),
    ("How do I restore my Books?",
     "Open the Store and tap Restore Purchases. Book unlocks belong to your Apple Account, so they come back on any of your devices. "
     "Whisper packs are consumable, so Restore Purchases doesn't bring back whispers you've already bought."),
    ("Can I get a refund?",
     'Refunds for App Store purchases are handled by Apple. Visit <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>, '
     "sign in, find the MythCraft purchase and request a refund."),
    ("Does MythCraft use AI?",
     "The chips, recipes, story and Codex lines are all written by hand. On devices with Apple Intelligence, the Fates may add short "
     "narration lines written on your device by Apple's model. They never change the story, and nothing leaves your device."),
    ("I've found a bug. What do I do?",
     f"Email {MAIL} with what you were doing, what you expected and what happened, plus your device and iOS version. "
     "A screenshot helps a lot."),
]

privacy_body = f"""      <p class="section-eyebrow">LEGAL</p>
      <h1 class="section-title slab-text">PRIVACY POLICY</h1>
      <p class="legal-updated">Last updated {UPDATED}</p>
      <p class="section-lede">This policy explains, in plain language, what MythCraft does with your information. The short answer: very little, on purpose.</p>
      <div class="legal-promises">
        <h2 class="slab-text">OUR PROMISES</h2>
        <ul>
{chr(10).join(f'          <li>{p}</li>' for p in PROMISES)}
        </ul>
      </div>
{sections(PRIVACY)}"""

faq = "\n".join(
    f"""      <details class="legal-faq">
        <summary>{q}</summary>
        <p>{a}</p>
      </details>""" for q, a in FAQS)
support_body = f"""      <p class="section-eyebrow">SUPPORT</p>
      <h1 class="section-title slab-text">EVEN HEROES ASK FOR DIRECTIONS.</h1>
      <p class="section-lede">Most answers are below. If yours isn't, email us and a real person will get back to you.</p>
      <div class="legal-contact">
        <div>
          <h2 class="slab-text">CONTACT</h2>
          <p>{MAIL}</p>
        </div>
        <a class="btn btn-gold btn-big" href="mailto:{EMAIL}?subject=MythCraft%20support">Send a message</a>
      </div>
      <h2 class="slab-text legal-faq-title">FREQUENTLY ASKED</h2>
{faq}
      <p class="legal-note">How we handle your information is set out in the <a href="../privacy/">privacy policy</a>.</p>"""

for slug, title, desc, body in [
    ("privacy", "Privacy Policy", "How MythCraft handles your information. No account, no analytics, no ads, no tracking. Your progress stays on your device and in your own iCloud.", privacy_body),
    ("support", "Support", "Help and answers for MythCraft, the Greek mythology crafting game.", support_body),
]:
    os.makedirs(os.path.join(root, slug), exist_ok=True)
    with open(os.path.join(root, slug, "index.html"), "w") as f:
        f.write(page(slug, title, desc, body))
    print("wrote", slug)
