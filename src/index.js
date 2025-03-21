document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list");
    const quoteForm = document.getElementById("new-quote-form");
  
    // Fetch and display quotes
    function fetchQuotes() {
      fetch("http://localhost:3000/quotes?_embed=likes")
        .then((response) => response.json())
        .then((quotes) => {
          quoteList.innerHTML = "";
          quotes.forEach(renderQuote);
        });
    }
  
    function renderQuote(quote) {
      const li = document.createElement("li");
      li.classList.add("quote-card");
  
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      `;
  
      // Like button functionality
      const likeBtn = li.querySelector(".btn-success");
      likeBtn.addEventListener("click", () => {
        fetch("http://localhost:3000/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quoteId: quote.id }),
        })
          .then((response) => response.json())
          .then(() => {
            let likeCount = parseInt(likeBtn.querySelector("span").textContent);
            likeBtn.querySelector("span").textContent = likeCount + 1;
          });
      });
  
      // Delete button functionality
      const deleteBtn = li.querySelector(".btn-danger");
      deleteBtn.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
          method: "DELETE",
        }).then(() => li.remove());
      });
  
      quoteList.appendChild(li);
    }
  
    // Add new quote
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const quoteInput = document.getElementById("new-quote").value;
      const authorInput = document.getElementById("author").value;
  
      const newQuote = {
        quote: quoteInput,
        author: authorInput,
      };
  
      fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuote),
      })
        .then((response) => response.json())
        .then((quote) => {
          renderQuote(quote);
          quoteForm.reset();
        });
    });
  
    fetchQuotes();
  });
  