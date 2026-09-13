export async function copyText(text) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard access is unavailable in this browser.');
  }

  await navigator.clipboard.writeText(text);
  return true;
}
