const $ = (id)=>document.getElementById(id);
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

$('loginTG').onclick = async () => {
  const username = $('username').value.trim();
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) { alert('Bad username'); return; }

  const start = await fetch('/api/auth-start', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ username })
  }).then(r=>r.json()).catch(()=>null);

  if(!start || !start.sessionToken){ alert('Failed to start'); return; }

  window.open(start.botLink, '_blank');

  $('status').style.display='block';
  let tries = 120; // ~2 min
  while (tries-- > 0) {
    const st = await fetch('/api/auth-poll?token='+encodeURIComponent(start.sessionToken))
      .then(r=>r.json()).catch(()=>({status:'ERR'}));
    if (st.status === 'CONFIRMED') {
      const done = await fetch('/api/auth-complete', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ sessionToken: start.sessionToken })
      }).then(r=>r.json());
      if (done?.ok) {
        $('result').style.display='block';
        $('result').textContent = 'Logged in as '+done.user.username+' • OkCash '+done.user.okcash;
        $('status').style.display='none';
        return;
      }
    }
    await sleep(1000);
  }
  $('status').textContent = 'Timed out. Try again.';
};
