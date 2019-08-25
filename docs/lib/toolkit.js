const toolkit = {
    // Decode Base64
    // Ref: https://nelluil.postach.io/post/btoa-atob-zhi-yuan-zhong-wen-de-fang-fa
    // Ref: https://cnodejs.org/topic/4fd6b7ba839e1e581407aac8
    decodeBase64: (text) => unescape(decodeURIComponent(escape(window.atob(text.replace(/\-/g, "+").replace(/\_/g, "/"))))),
    getBsId: (imgUrl) => imgUrl.replace(/[^a-zA-Z0-9]/g, "").slice(- 10).toLowerCase(),
    lngLatToIntel: (lngLat) => `${value.string.path.intel}?ll=${lngLat.lat},${lngLat.lng}&z=18`,
    getDateString: (time) => {
        const date = new Date();
        date.setTime(time);
        return date.toLocaleDateString();
    },
    getDateTimeString: (time) => {
        const date = new Date();
        date.setTime(time);
        return date.toLocaleString();
    },
    getDateTimeISOString: (time) => {
        const date = new Date();
        date.setTime(time);
        return date.toISOString();
    },
    getIntervalString: (start, end) => {
        const day = Math.floor((end - start) / (24 * 3600 * 1000));
        return `${day} day${(day > 2 ? "s" : "")}`;
    },
    getIconElement: (portal) => {
        const iconDiv = document.createElement("div");
        iconDiv.className = "map-marker";
        const icon = document.createElement("span");
        icon.className = "material-icons md-18";
        switch (portal.status) {
            case value.code.status.pending:
                iconDiv.className += `${value.string.html.css.pending}--bg`;
                icon.innerHTML = value.string.html.icon.pending;
                break;
            case value.code.status.accepted:
                iconDiv.className += `${value.string.html.css.accepted}--bg`;
                icon.innerHTML = value.string.html.icon.accepted;
                break;
            default:
                switch (portal.status) {
                    case value.code.status.rejected.tooClose:
                        icon.innerHTML = value.string.html.icon.rejectedReason.tooClose;
                        break;
                    case value.code.status.rejected.duplicated:
                        icon.innerHTML = value.string.html.icon.rejectedReason.duplicated;
                        break;
                    default:
                        icon.innerHTML = value.string.html.icon.rejectedReason.undeclared;
                        break;
                }
                iconDiv.className += `${value.string.html.css.rejected}--bg`;
                break;
        }
        iconDiv.appendChild(icon);
        return iconDiv;
    },
};