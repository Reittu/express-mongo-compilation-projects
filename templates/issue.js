const fetch = require("node-fetch");
// Simply using a template string instead of template engine like Pug.
// Other data-reliant projects in this compilation use client-side/hybrid rendering as opposed to this server side rendering.
exports.specific = async function specificProject(data) {
    const fetchData = await fetch(
        "https://reittu.azurewebsites.net/api/issues/" + data.project // Requires absolute URI
    )
        .then(res => res.json())
        .catch(err => console.error("Project url possibly changed!", err));
    return `<!DOCTYPE html>
<html lang="en" style="scroll-behavior: smooth">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" href="https://cdn.glitch.com/a131b892-3563-4249-bd6b-5b8f09d6f557%2Ffavicon.ico?v=1580125845578" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Express Compilation Project - Issue Tracker</title>
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="/css/form_style.css" />
    <link rel="stylesheet" href="/css/issue_style.css" />
</head>

<body>
    <div class="container">
      <h1>All issues for: <span id="project-name">${data.project}</span></h1>
      <div style="margin-bottom: 2rem">
          <h3>Submit a new issue:</h3>
          <form id="new-issue-form" method="post" action="${'/api/issues/' + data.project}" onsubmit="handleSubmit(event, 'POST')">
              <input type="text" name="issue_title" placeholder="Title *" required>
              <textarea type="text" name="issue_text" placeholder="Issue description *" rows="5" maxlength="3000" required></textarea>
              <input type="text" name="created_by" placeholder="Created by *" required>
              <input type="text" name="assigned_to" placeholder="Assigned to">
              <input type="text" name="status_text" placeholder="Status text">
              <input type="submit" value="Submit Issue">
          </form>
      </div>
      <div id="issues-container">
          ${fetchData !== "TypeError: Failed to fetch" ? renderIssues(fetchData) : "<h1>Error</h1><p>Fetch failed (issue.js), please notify the administrator of this if this is frequent.</p>"}
      </div>
      ${fetchData.length > 0 ? `
      <h3>Only fill fields that you want to update:</h3>
      <form id="edit-issue-form" method="put" action="${'/api/issues/' + data.project}" onsubmit="handleSubmit(event, 'PUT')">
          <input type="text" name="id" placeholder="Id *" id="edit-issue-id" required>
          <input type="text" name="issue_title" placeholder="Title">
          <textarea type="text" name="issue_text" placeholder="Issue description" rows="5" maxlength="3000"></textarea>
          <input type="text" name="created_by" placeholder="Created by">
          <input type="text" name="assigned_to" placeholder="Assigned to">
          <input type="text" name="status_text" placeholder="Status text">
          <input type="submit" value="Update Issue">
      </form>
      ` : ""}
    </div>
    <script src="/js/issueTracker.js"></script>
</body>

</html>
`;
};

function renderIssues(fetchData) {
    const issueArray = fetchData.map(
        x =>
            `<div class="issue-container" style="${x.open ? "" : "opacity: 0.2;"}" id="${"issue-" + x._id}">
         <p class="issue-id">id: <span>${x._id}</span></p>
         <p><strong><span>${x.issue_title}</span> - (<span class="issue-status">${x.open ? "open" : "closed"}</span>)</strong></p>
         <p>${x.issue_text}</p>
         <p style="color: #a9a9a9;">${x.status_text}</p>
         <div class="side-data-container">
           <p>Created by: <span>${x.created_by}</span></p>
           <p>Assigned to: <span>${x.assigned_to}</span></p>
           <p>Created on: <span>${new Date(x.created_on).toGMTString()}</span></p>
           <p>Last updated: <span>${new Date(x.updated_on).toGMTString()}</span></p>
         </div>
         <p class="btn-container">
           <button class="btn btn-status-toggle" onclick="handleStatusToggle('${x._id}', ${!x.open})">${x.open ? "CLOSE" : "OPEN"}</button>
           <button class="btn btn-edit" onclick="handleEdit('${x._id}')">EDIT</button>
           <button class="btn btn-delete" onclick="handleDelete('${x._id}')">DELETE</button>
         </p>
       </div>`
    );
    return issueArray.join('');
}
