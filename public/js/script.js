// applayer
const aplayer = document.querySelector("#aplayer")
if (aplayer) {
    let dataSong = aplayer.getAttribute("data-song");
    dataSong = JSON.parse(dataSong);

    let dataSinger = aplayer.getAttribute("data-singer");
    dataSinger = JSON.parse(dataSinger);
    const ap = new APlayer({
        container: aplayer,
        audio: [{
            name: dataSong.title,
            artist: dataSinger.fullName,
            url: dataSong.audio,
            cover: dataSong.avatar
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

// button favorite
const buttonFavorite = document.querySelector("[button-favorite]");
if (buttonFavorite) {
    buttonFavorite.addEventListener("click", () => {
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