import { sendAlert } from "./alerts";
import postArticle from "./postArticle";
import { addImage, addField, addImageView } from "./view";

let count = 0;

window.addEventListener("load", () => {
  console.log(localStorage);
  if (localStorage.getItem("count")) count = localStorage.getItem("count") * 1;
  let arr = [],
    pos;
  for (var i = 0; i < localStorage.length; i++) {
    var tag = localStorage.key(i);
    var value = localStorage.getItem(tag);

    if (tag.startsWith("title") || tag.startsWith("intr")) {
      $(`#${tag}`).val(value);
      $(`#view${tag}`).text(value);
    }
    if (tag.startsWith("cover")) {
      value = value.split("\\");
      value = value[value.length - 1];
      //console.log(value);
      addImageView(tag, value);
    }

    if (
      tag.startsWith("heading") ||
      tag.startsWith("sub") ||
      tag.startsWith("para") ||
      tag.startsWith("code") ||
      tag.startsWith("image")
    ) {
      pos = tag.split("-")[1] * 1 - 1;
      if (arr[pos]) {
        let temp = {};
        temp[tag] = value;
        arr[pos] = Object.assign(arr[pos], temp);
      } else {
        let temp = {};
        temp[tag] = value;
        arr[pos] = temp;
      }
    }
  }
  i = 0;
  for (let con of arr) {
    if (con) {
      if (con[`heading-${i + 1}`]) {
        addField(`heading-${i + 1}`, con[`heading-${i + 1}`]);
      }
      if (con[`subHeading-${i + 1}`]) {
        addField(`subHeading-${i + 1}`, con[`subHeading-${i + 1}`]);
      }
      if (con[`paragraph-${i + 1}`]) {
        addField(`paragraph-${i + 1}`, con[`paragraph-${i + 1}`]);
      }
      if (con[`code-${i + 1}`]) {
        addField(`code-${i + 1}`, con[`code-${i + 1}`]);
      }
      if (con[`image-${i + 1}`]) {
        addImage(`image-${i + 1}`);
        value = con[`image-${i + 1}`];
        value = value.split("\\");
        value = value[value.length - 1];
        addImageView(`image-${i + 1}`, value);
      }
    }
    i++;
  }
  if (localStorage.length > 0) sendAlert("success", "saved data loaded");
});

jQuery(() => {
  $("#code").hide();
  var arr = [];

  $("#design").on("change", function () {
    if ($(this).val() == 2) {
      $("#code").show();
      $("#image").hide();
    }
    if ($(this).val() == 1) {
      $("#code").hide();
      $("#image").show();
    }
  });

  $("#content").on("click", function (e) {
    e.preventDefault();
    if (arr.includes(e.target)) {
      arr = [];
      count++;
    }
    arr.push(e.target);
    if (e.target.id === "image") {
      addImage(`${e.target.id}-${count + 1}`);
    } else {
      addField(`${e.target.id}-${count + 1}`, null);
    }
  });

  $(".btns").on("click", function (e) {
    if (e.target.id === "save") {
      localStorage.setItem("count", `${count === 0 ? count + 1 : count}`);
      let elements = $(".article").children();
      for (var element of elements) {
        if (element.id === "" || element.id === "content") continue;
        if (
          element.id.startsWith("coverImage") &&
          document.querySelector(`#${element.id}`).files[0]
        ) {
          localStorage.setItem(
            element.id,
            document.querySelector(`#${element.id}`).files[0].name
          );
        }
        if (
          element.id.startsWith("image") &&
          document.querySelector(`#${element.id}`).files[0]
        ) {
          localStorage.setItem(
            element.id,
            document.querySelector(`#${element.id}`).files[0].name
          );
          continue;
        }
        localStorage.setItem(element.id, element.value);
      }
      sendAlert("success", "Current data has been saved");
    } else if (e.target.id === "post") {
      //posting the article to the servers
      var form = new FormData();
      let elements = $(".article").children();
      for (let i of elements) {
        if (i.id === "" || i.id === "content") continue;
        if (i.id.startsWith("image") || i.id.startsWith("coverImage")) {
          form.append(`${i.id}`, i.files[0]);
          continue;
        }
        form.append(`${i.id}`, i.value);
      }

      let env = prompt("Select the enviornment", "dev");
      postArticle(env, form);
    } else if (e.target.id === "clear") {
      localStorage.clear();
      sendAlert("success", "Local storage cleared");
    }
  });

  $(".article").on("click", (e) => {
    if ($(e.target).hasClass("files")) {
      const id = $(e.target).attr("for");

      setTimeout(() => {
        let name = document.querySelector(`#${id}`).files[0].name;
        addImageView(id, name);
      }, 11000);
    }
  });

  $(".article").keyup((e) => {
    let id = `#view${e.target.id}`,
      value = e.target.value;
    //console.log(id, value);
    $(id).text(value);
  });

  $("#set").on("click", () => {
    count = $("#count").val() * 1;
    //console.log(count);
    sendAlert("success", `Count value = ${count}`);
  });
});
