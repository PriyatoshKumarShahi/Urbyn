import nodemailer from 'nodemailer';

const hasSmtpConfig = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS
);

const transport = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : nodemailer.createTransport({ jsonTransport: true });

const mailFrame = ({ title, intro, body, ctaLabel, ctaUrl }) => `
  <div style="font-family:Inter,Arial,sans-serif;background:#fffaf3;padding:24px;color:#0f172a;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:3px solid #111827;border-radius:22px;overflow:hidden;box-shadow:6px 6px 0 #111827;">
      <div style="background:#fde68a;padding:20px 24px;border-bottom:3px solid #111827;">
        <div style="font-size:28px;font-weight:900;">Urbyn</div>
        <div style="font-size:14px;font-weight:700;opacity:.8;">Smarter city accountability platform</div>
      </div>
      <div style="padding:24px;">
        <h2 style="margin:0 0 12px;font-size:24px;line-height:1.2;">${title}</h2>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;">${intro}</p>
        ${body}
        ${ctaUrl ? `<div style="margin-top:22px;"><a href="${ctaUrl}" style="display:inline-block;background:#86efac;color:#111827;text-decoration:none;padding:12px 16px;border:3px solid #111827;border-radius:16px;font-weight:800;">${ctaLabel || 'View issue'}</a></div>` : ''}
      </div>
    </div>
  </div>
`;

const issueDetailsHtml = (issue) => `
  <div style="border:3px solid #111827;border-radius:18px;padding:16px;background:#f8fafc;">
    <div style="font-size:18px;font-weight:800;margin-bottom:8px;">${issue.title}</div>
    <div style="font-size:14px;line-height:1.7;">
      <div><b>Status:</b> ${issue.status}</div>
      <div><b>Category:</b> ${issue.category}</div>
      <div><b>Department:</b> ${issue.department}</div>
      <div><b>Area:</b> ${issue.areaName || issue.addressText || 'Not specified'}</div>
      <div><b>Reported by:</b> ${issue.reporterName}</div>
      <div><b>Deadline:</b> ${issue.slaDeadline ? new Date(issue.slaDeadline).toLocaleString() : 'Not available'}</div>
      ${issue.description ? `<div style="margin-top:10px;"><b>Description:</b> ${issue.description}</div>` : ''}
    </div>
    ${issue.image ? `<img src="${issue.image}" alt="Issue" style="margin-top:14px;width:100%;max-height:280px;object-fit:cover;border:3px solid #111827;border-radius:16px;" />` : ''}
    ${issue.resolvedImage ? `<div style="margin-top:14px;"><div style="font-weight:800;margin-bottom:8px;">Proof of fix</div><img src="${issue.resolvedImage}" alt="Resolved Issue" style="width:100%;max-height:280px;object-fit:cover;border:3px solid #111827;border-radius:16px;" /></div>` : ''}
  </div>
`;

async function sendMail({ to, subject, html }) {
  if (!to) return;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'urbyn@example.com';
  const info = await transport.sendMail({ from, to, subject, html });
  if (!hasSmtpConfig) {
    console.log('Mail preview (jsonTransport):', info.message);
  }
}

export async function sendIssueCreatedEmails(issue, user) {
  const recipients = [process.env.ADMIN_EMAIL, user?.email].filter(Boolean).join(',');
  const html = mailFrame({
    title: 'A new issue was reported on Urbyn',
    intro: 'A new civic issue has been reported and is now visible in the Urbyn workflow.',
    body: issueDetailsHtml(issue),
    ctaLabel: 'Open Urbyn dashboard',
    ctaUrl: process.env.CLIENT_URL
  });
  await sendMail({ to: recipients, subject: `Urbyn • New issue reported • ${issue.title}`, html });
}

export async function sendIssueStatusEmails(issue, changedByName) {
  const reporterEmail = issue.createdBy?.email || issue.reporterEmail;
  const recipients = [process.env.ADMIN_EMAIL, reporterEmail].filter(Boolean).join(',');
  const html = mailFrame({
    title: `Issue moved to ${issue.status}`,
    intro: `The issue workflow has progressed. ${changedByName ? `Updated by ${changedByName}.` : ''}`,
    body: `
      <div style="margin-bottom:16px;font-size:15px;line-height:1.6;">
        <div><b>Current status:</b> ${issue.status}</div>
        <div><b>Timeline entries:</b> ${(issue.statusHistory || []).length}</div>
        ${issue.isOverdue ? `<div><b>Overdue:</b> Yes</div>` : ''}
      </div>
      ${issueDetailsHtml(issue)}
    `,
    ctaLabel: 'View issue on Urbyn',
    ctaUrl: `${process.env.CLIENT_URL}/issues/${issue._id}`
  });
  await sendMail({ to: recipients, subject: `Urbyn • Issue ${issue.status} • ${issue.title}`, html });
}
