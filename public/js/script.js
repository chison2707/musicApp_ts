// applayer
const aplayer = document.querySelector("#aplayer")
if (aplayer) {
    let dataSong = aplayer.getAttribute("data-song");
    dataSong = JSON.parse(dataSong);

    let dataSinger = aplayer.getAttribute("data-singer");
    dataSinger = JSON.parse(dataSinger);
    const ap = new APlayer({
        container: aplayer,
        lrcType: 1,
        audio: [{
            name: dataSong.title,
            artist: dataSinger.fullName,
            url: dataSong.audio,
            cover: dataSong.avatar,
            lrc: dataSong.lyrics
        }],
        autoplay: true
    });
    const avatar = document.querySelector(".singer-detail .inner-avatar");

    ap.on('play', function () {
        avatar.style.animationPlayState = "running";
    });

    ap.on('pause', function () {
        avatar.style.animationPlayState = "paused";
    });
    ap.on('ended', function () {
        const link = `/songs/listen/${dataSong._id}`;

        const option = {
            method: "PATCH"
        }

        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                const innerListen = document.querySelector(".singer-detail .inner-listen span");
                innerListen.innerHTML = `${data.listen} lượt nghe`;
            })
    });
}

// end applayer

// button like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
    buttonLike.addEventListener("click", () => {
        const idSong = buttonLike.getAttribute("button-like");
        const isActive = buttonLike.classList.contains("active");
        const typeLike = isActive ? "dislike" : "like"

        const link = `/songs/like/${typeLike}/${idSong}`;

        const option = {
            method: "PATCH"
        }

        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    const span = buttonLike.querySelector("span");
                    span.innerHTML = `${data.like} thích`;
                    buttonLike.classList.toggle("active");
                }
            })
    });
}
//end button like

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// Lấy giá trị tokenUser
const tokenUser = getCookie('tokenUser');

// button favorite
const listbuttonFavorite = document.querySelectorAll("[button-favorite]");
if (listbuttonFavorite.length > 0) {
    listbuttonFavorite.forEach(buttonFavorite => {
        if (!tokenUser) {
            buttonFavorite.classList.remove("active");
        }

        buttonFavorite.addEventListener("click", () => {
            if (!tokenUser) {
                window.location.href = "/users/login";
                return;
            }

            const idSong = buttonFavorite.getAttribute("button-favorite");
            const isActive = buttonFavorite.classList.contains("active");
            const typeFavorite = isActive ? "unfavorite" : "favorite"

            const link = `/songs/favorite/${typeFavorite}/${idSong}`;

            const option = {
                method: "PATCH"
            }

            fetch(link, option)
                .then(res => res.json())
                .then(data => {
                    if (data.code == 200) {
                        buttonFavorite.classList.toggle("active");
                    }
                })
        });
    })
}
//end button favorite

// alert
document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert[show-alert]');

    alerts.forEach(alert => {
        const time = alert.getAttribute('data-time');

        // Show alert with slide-in effect
        setTimeout(() => {
            alert.classList.add('show');
        }, 100);

        setTimeout(() => {
            alert.classList.add('hide');
            setTimeout(() => alert.remove(), 500); // Remove alert after animation ends
        }, time);

    });
});
// end alert

// search suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
    const input = boxSearch.querySelector('input[name="keyword"]');
    input.addEventListener("keyup", () => {
        const keyword = input.value;

        const link = `/search/suggest/?keyword=${keyword}`;

        fetch(link)
            .then(res => res.json())
            .then(data => {
                const songs = data.songs;
                const innerSuggest = boxSearch.querySelector(".inner-suggest");

                if (songs.length > 0) {
                    innerSuggest.classList.add("show");

                    const htmls = songs.map(song => {
                        return `<a class="inner-item" href="/songs/detail/${song.slug}">
                                    <div class="inner-image">
                                    <img src="${song.avatar}">
                                    </div>
                                    <div class="inner-info">
                                    <div class="inner-title">${song.title}</div>
                                    <div class="inner-singer">
                                        <i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger.fullName}
                                    </div>
                                    </div>
                                </a>`
                    });

                    const innerList = boxSearch.querySelector(".inner-list");
                    innerList.innerHTML = htmls.join("");
                } else {
                    innerSuggest.classList.remove("show");
                }
            })
    });
}
// end search suggest