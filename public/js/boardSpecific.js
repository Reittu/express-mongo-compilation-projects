const pagination = document.querySelector(".pagination");

(function initializePage() {
  const cleanedUrl = location.href.replace(/\/$/, "");
  const splitUrl = cleanedUrl.split("/");
  const suffix = splitUrl[splitUrl.length - 1];
  const pageQuery = suffix.match(/\?page=\d+/);
  // URL could potentially contain other queries so can't just substract.
  const queryFreeUrl = location.href.replace(/\?.*$/, "");
  const startPage =
    !pageQuery || pageQuery[0].split("=")[1] < 1
      ? 1
      : Number(pageQuery[0].split("=")[1]);

  // Greedy match; goes all the way to last /.
  const boardName = queryFreeUrl.replace(/.*\//, "");
  document.querySelector(".board-header").innerText += boardName;
  document.querySelector("#new-thread-form").action += boardName;

  fetch("/api/boards")
    .then(res => res.json())
    .then(boards => {
      if (!boards) return;
      const [thisBoard] = boards.filter(board => board.name === boardName);
      if (thisBoard) {
        const baseUrl = "/api/threads/" + boardName;
        const queryUrl = pageQuery ? baseUrl + pageQuery : baseUrl;
        fetch(queryUrl)
          .then(res => res.json())
          .then(board => updateDomWithThreads(board, queryFreeUrl, boardName))
          .catch(err => console.log(err));
        createPagination(startPage, thisBoard.threadCount, queryFreeUrl);
      }
    })
    .catch(err => console.log(err));
})();

function updateDomWithThreads(board, queryFreeUrl, boardName) {
  if (!board.threads) return;
  const threadContainer = document.querySelector(".thread-container");
  for (let i = 0; i < board.threads.length; i++) {
    const thread = createGenericElement("div", "thread");
    thread.onclick = () => {
      const win = window.open(
        queryFreeUrl + "/" + board.threads[i]._id,
        "_blank"
      );
      win.focus();
    };
    threadContainer.append(thread);

    // First post of the thread (creator)
    const threadMain = createGenericElement("div", "thread-main");
    const threadInfo = createGenericElement("div", "post-info");
    const postId = createGenericElement(
      "span",
      "post-id",
      board.threads[i]._id
    );
    const postDate = createGenericElement(
      "span",
      "post-date",
      new Date(board.threads[i].created_on).toGMTString()
    );

    const deleteButton = createGenericElement(
      "button",
      "btn btn-delete",
      "DELETE"
    );
    deleteButton.onclick = e => {
      e.stopPropagation();
      deleteRequest(
        "/api/threads/" + boardName,
        {
          thread_id: board.threads[i]._id
        },
        e
      );
    };

    const reportButton = createGenericElement(
      "button",
      "btn btn-report",
      "REPORT"
    );
    reportButton.onclick = e => {
      e.stopPropagation();
      reportPutRequest("/api/threads/" + boardName, {
        thread_id: board.threads[i]._id
      });
    };

    threadInfo.append(postId, postDate, deleteButton, reportButton);

    const threadText = createGenericElement(
      "p",
      "post-text",
      board.threads[i].text
    );
    threadMain.append(threadInfo, threadText);
    thread.append(threadMain);

    // Append oldest replies first (normal order j = 0; j < ...replies.length; j++)
    for (let j = board.threads[i].replies.length - 1; j >= 0; j--) {
      const reply = createGenericElement("div", "thread-reply");
      const replyInfo = createGenericElement("div", "post-info");
      const postId = createGenericElement(
        "span",
        "post-id",
        board.threads[i].replies[j]._id
      );
      const postDate = createGenericElement(
        "span",
        "post-date",
        new Date(board.threads[i].replies[j].created_on).toGMTString()
      );

      const deleteButton = createGenericElement(
        "button",
        "btn btn-delete",
        "DELETE"
      );
      deleteButton.onclick = e => {
        e.stopPropagation();
        deleteRequest(
          "/api/replies/" + boardName,
          {
            reply_id: board.threads[i].replies[j]._id
          },
          e
        );
      };

      const reportButton = createGenericElement(
        "button",
        "btn btn-report",
        "REPORT"
      );
      reportButton.onclick = e => {
        e.stopPropagation();
        reportPutRequest("/api/replies/" + boardName, {
          reply_id: board.threads[i].replies[j]._id
        });
      };

      replyInfo.append(postId, postDate, deleteButton, reportButton);

      const replyText = createGenericElement(
        "p",
        "post-text",
        board.threads[i].replies[j].text
      );

      reply.append(replyInfo, replyText);
      thread.append(reply);
    }
  }
  // Done so animation is triggered at the same time as threads are loaded
  document.querySelector(".pagination-wrapper").removeAttribute("style");
}

function createPagination(page = 1, threadCount, queryFreeUrl) {
  let startPage, currentPage, endPage;
  startPage = currentPage = page;

  const threadsLeftAhead = threadCount - startPage * 10;
  const pagesLeftAhead = Math.ceil(threadsLeftAhead / 10);

  endPage = startPage + 9;

  if (pagesLeftAhead < endPage - startPage) {
    endPage = startPage + pagesLeftAhead;
    startPage = Math.max(endPage - 9, 1);
  }

  if (currentPage > 1) {
    if (currentPage > 2)
      createAndAppendPageButton(
        "<<",
        queryFreeUrl + "?page=1",
        pagination,
        "btn-arrow"
      );
    createAndAppendPageButton(
      "<-",
      queryFreeUrl + "?page=" + (currentPage - 1),
      pagination,
      "btn-arrow"
    );
  }
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createAndAppendPageButton(
      i,
      queryFreeUrl + "?page=" + i,
      pagination
    );
    if (i === currentPage) {
      pageButton.className += " pagination-current";
      pageButton.removeAttribute("href");
    }
  }
  if (currentPage < endPage) {
    createAndAppendPageButton(
      "->",
      queryFreeUrl + "?page=" + (currentPage + 1),
      pagination,
      "btn-arrow"
    );
    if (endPage > currentPage + 1)
      createAndAppendPageButton(
        ">>",
        queryFreeUrl + "?page=" + (currentPage + pagesLeftAhead),
        pagination,
        "btn-arrow"
      );
  }
}

function createAndAppendPageButton(text, href, parent, classSuffix) {
  const className = classSuffix
    ? "pagination-button " + classSuffix
    : "pagination-button";
  const pageButton = createGenericElement("a", className, text);
  pageButton.href = href;
  parent.append(pageButton);
  return pageButton;
}

function createGenericElement(elementType, className, innerText) {
  const element = document.createElement(elementType);
  if (className) element.className = className;
  if (innerText) element.innerText = innerText;
  return element;
}

function deleteRequest(url, body, e) {
  const password = prompt("Enter the delete password");
  if (password) {
    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res === "success")
          e.target.parentElement.parentElement.querySelector(
            ".post-text"
          ).innerText = "[deleted]";
        alert(res);
      })
      .catch(err => alert(err));
  }
}

function reportPutRequest(url, body) {
  if (confirm("Report this post?")) {
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => alert(res))
      .catch(err => alert(err));
  }
}
