export function addImage(tag) {
  let htmlString;
  htmlString = `<label for="${tag}" class="labels">${tag}</label><input type="file" name="${tag}" id="${tag}" class='js--file'>`;
  $("#content").before($(htmlString));
  htmlString = `<label for="${tag}" class="files">Upload image</label>`;
  $("#content").before($(htmlString));
}

export function addImageView(tag, src) {
  let htmlString;
  htmlString = `<img src="/images/${src}" alt="${tag}" id="view${tag}" class="article__image">`;
  $(".preview").children().last().after(htmlString);
}

export function addField(tag, value) {
  let htmlString = `<label for="${tag}" class="labels">${tag}</label><textarea name="${tag}" id="${tag}" class="fields__area">${value}</textarea>`;
  $("#content").before($(htmlString));
  if (tag.startsWith("paragraph")) {
    htmlString = `<p class="paragraph" id="view${tag}">${value}</p>`;
  } else if (tag.startsWith("heading")) {
    htmlString = `<h4 id="view${tag}">${value}</h4>`;
  } else if (tag.startsWith("sub")) {
    htmlString = `<h5 id="view${tag}">${value}</h5>`;
  } else if (tag.startsWith("code")) {
    htmlString = `<p class="code" id="view${tag}">${value}</p>`;
  }
  $(".preview").children().last().after(htmlString);
}
