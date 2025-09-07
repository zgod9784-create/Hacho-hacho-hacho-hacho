const $ = (id)=>document.getElementById(id);
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

$('loginTG').onclick = async () => {
  const username = $('username').value.trim();
  if (!/^[a-z0-9_]{3,20}$/i.test(username)) { alert('Bad username'); return; }

  const start = await fetch('/api/auth-start', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ username })
  }).then(r=>r.json()).catch(()=>null);

  if (!start || !start.sessionToken) { alert('Failed to start'); return; }

  // Demo: open bot link (tum apna bot username daal dena)
  window.open(start.botLink || 'https://t.me/okwalletverifybot', '_blank');

  $('status').style.display='block';
  let tries = 60; // ~ 60 sec
  let st_status = 'PENDING';

  while (tries-- > 0) {
    const st = await fetch('/api/auth-poll?token='+encodeURIComponent(start.sessionToken))
      .then(r=>r.json()).catch(()=>({status:'ERR'}));
    if (st.status === 'CONFIRMED') { st_status = 'CONFIRMED'; break; }
    await sleep(1000);
  }

  if (st_status !== 'CONFIRMED') {
    $('status').textContent = 'Timeout or cancelled.';
    return;
  }

  const done = await fetch('/api/auth-complete', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ token: start.sessionToken })
  }).then(r=>r.json()).catch(()=>null);

  if (done?.ok) {
    $('result').textContent = `Success! user: ${done.username}  •  pass: ${done.password}`;
    $('status').textContent = 'You can now continue to dashboard (demo).';
  } else {
    $('status').textContent = 'Complete failed.';
  }
};
