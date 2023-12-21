const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.remove("hidden");
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
      entry.target.classList.add("hidden");
    }
  });
});

const observer1 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.remove("hidden1");
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
      entry.target.classList.add("hidden1");
    }
  });
});

const observer2 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.remove("hidden2");
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
      entry.target.classList.add("hidden2");
    }
  });
});

const hiddenItems = document.querySelectorAll(".hidden");
hiddenItems.forEach((e) => observer.observe(e));

const hidden1Items = document.querySelectorAll(".hidden1");
hidden1Items.forEach((e) => observer1.observe(e));

const hidden2Items = document.querySelectorAll(".hidden2");
hidden2Items.forEach((e) => observer2.observe(e));


