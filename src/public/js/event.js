document.addEventListener('DOMContentLoaded', () => {
  const responseDiv = document.getElementById('response');
  const buttons = {
    createJob: document.getElementById('createJob'),
    getJobStatus: document.getElementById('getJobStatus'),
    getCandidate: document.getElementById('getCandidate'),
    sendWebhook: document.getElementById('sendWebhook'),
  };

  // Helper to disable/enable buttons
  const toggleButtons = (disabled) => {
    Object.values(buttons).forEach(button => {
      button.disabled = disabled;
      button.classList.toggle('disabled', disabled);
    });
  };

  // Helper to display response
  const displayResponse = (data, error = null) => {
    if (error) {
      responseDiv.innerText = `Error: ${error.message}\nStatus: ${error.status || 'N/A'}\nDetails: ${error.details || 'No additional details'}`;
      responseDiv.classList.add('text-danger');
    } else {
      responseDiv.innerText = JSON.stringify(data, null, 2);
      responseDiv.classList.remove('text-danger');
    }
  };

  buttons.createJob.addEventListener('click', async () => {
    toggleButtons(true);
    try {
      const res = await fetch('/api/jobs', { method: 'POST' });
      if (!res.ok) throw { message: 'Failed to create job', status: res.status, details: await res.text() };
      const data = await res.json();
      displayResponse(data);
    } catch (error) {
      displayResponse(null, error);
    } finally {
      toggleButtons(false);
    }
  });

  buttons.getJobStatus.addEventListener('click', async () => {
    toggleButtons(true);
    try {
      const res = await fetch('/api/jobs/12345/status');
      if (!res.ok) throw { message: 'Failed to get job status', status: res.status, details: await res.text() };
      const data = await res.json();
      displayResponse(data);
    } catch (error) {
      displayResponse(null, error);
    } finally {
      toggleButtons(false);
    }
  });

  buttons.getCandidate.addEventListener('click', async () => {
    toggleButtons(true);
    try {
      const res = await fetch('/api/candidates/67890');
      if (!res.ok) throw { message: 'Failed to get candidate', status: res.status, details: await res.text() };
      const data = await res.json();
      displayResponse(data);
    } catch (error) {
      displayResponse(null, error);
    } finally {
      toggleButtons(false);
    }
  });

  buttons.sendWebhook.addEventListener('click', async () => {
    toggleButtons(true);
    try {
      const res = await fetch('/webhooks/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: '12345', status: 'Open' }),
      });
      if (!res.ok) throw { message: 'Failed to send webhook', status: res.status, details: await res.text() };
      const data = await res.json();
      displayResponse(data);
    } catch (error) {
      displayResponse(null, error);
    } finally {
      toggleButtons(false);
    }
  });
});