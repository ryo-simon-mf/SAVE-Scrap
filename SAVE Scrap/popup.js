var url = "";
var time;
var text;
var hour;
var min;
var sec;
var dispName;

window.onload = function(){
  hour = localStorage.getItem("hour");
  min = localStorage.getItem("min");
  sec = localStorage.getItem("sec");
  dispName = localStorage.getItem("dispName");
  if (hour != undefined) document.getElementById('last').innerHTML = hour + " : " + min + " : " + sec + '<br>' + dispName;
}

document.getElementById("save").addEventListener("click",getUrl);

function getUrl(){
  chrome.tabs.getSelected(null, function(tab){
        url = tab.url;
  });
  setTimeout(SaveScrap,100);
}

function SaveScrap(){
  var domain = url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1];
  //indexOfに書き換えてもいいかも
    switch (domain) {
    case 'scrapbox.io':

      var pageName = url.match(/scrapbox.io(.+)/)[1];
      var wantUrl = 'https://scrapbox.io/api/pages' + pageName + '/text';

      time = new Date();
      hour = time.getHours();
      min = time.getMinutes();
      sec = time.getSeconds();

      var xhr = new XMLHttpRequest();
      xhr.open("GET",wantUrl,true);
      xhr.addEventListener("load",function(ev){
        time = Math.round(time.getTime() / 1000);
        text = new Blob([xhr.responseText], {type: 'text/plain'});
        var a = document.createElement('a');
          a.href = window.URL.createObjectURL(text);
          a.download = decodeURI(pageName) + time + '.txt';
          a.click();
      });
      xhr.send();

      dispName = pageName.slice(pageName.lastIndexOf('/')+1);
      document.getElementById('last').innerHTML = hour + " : " + min + " : " + sec + '<br>' + dispName;
      localStorage.setItem("hour", hour);
      localStorage.setItem("min", min);
      localStorage.setItem("sec", sec);
      localStorage.setItem("dispName", dispName);

      break;
    default:
      alert("scrapbox.ioでのみ使用可能です");
      break;
    }

}
