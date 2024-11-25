const array = [
  "1732180270200x182448469934080000",
  "1545105553167x858556260944445400",
  "1721923534736x420292126780162050",
  "1562944220587x824887912866512900",
  "1591977485236x956030487387177000",
  "1635765869620x634856253455597600",
  "1526577488975x638785657952010200",
  "1598992887080x658475225786875900",
];

const formWrapper = document.querySelector(".custom");

array.forEach((item) => {
  formWrapper.innerHTML += `<label class="w-checkbox"><input checked type="checkbox" id="${item}" name="${item}" data-name="Checkbox 2" class="w-checkbox-input"><span fs-cmsfilter-field="IDENTIFIER" class="w-form-label" for="${item}">${item}</span></label>`;
});
