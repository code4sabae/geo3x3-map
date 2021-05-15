import L from "https://code4sabae.github.io/leaflet-mjs/leaflet.mjs";
import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";

class Geo3x3Map extends HTMLElement {
  constructor () {
    super();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://code4sabae.github.io/leaflet-mjs/leaflet.css";
    this.appendChild(link);
    link.onload = () => this.init();
  }
  async init () {
    const div = document.createElement("div");
    this.appendChild(div);
    div.style.width = this.getAttribute("width") || "100%";
    div.style.height = this.getAttribute("height") || "60vh";
    const icon = this.getAttribute("icon");
    const iconsize = this.getAttribute("iconsize") || 30;

    const map = L.map(div);
    // set 国土地理院地図 https://maps.gsi.go.jp/development/ichiran.html
    L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
      attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>"',
      maxZoom: 18,
    }).addTo(map);

    const iconlayer = L.layerGroup();
    iconlayer.addTo(map);

    const data = this.getAttribute("code").split(",");

    console.log(data);
    const lls = [];
    for (const code of data) {
      const pos = Geo3x3.decode(code);
      console.log(pos);
      if (!pos) {
        continue;
      }
      const ll = [pos.lat, pos.lng];
      console.log(ll);
      const title = code; // "title"; // d["schema:name"] || d["name"];
      const url = "";
      //const url = d["schema:url"] || d["url"];
      const opt = { title };
      if (icon) {
        opt.icon = L.icon({
          iconUrl: icon,
          iconRetilaUrl: icon,
          iconSize: [iconsize, iconsize],
          iconAnchor: [iconsize / 2, iconsize / 2],
          popupAnchor: [0, -iconsize / 2],
        });
      }
      const marker = L.marker(ll, opt);
      //marker.bindPopup((title ? `<a href=${url}>${title}</a>` : ""));
      marker.bindPopup(title);
      iconlayer.addLayer(marker);
      lls.push(ll);
    }
    console.log(lls);
    if (lls.length) {
      map.fitBounds(lls);
    }
  }
}

customElements.define('geo3x3-map', Geo3x3Map);
