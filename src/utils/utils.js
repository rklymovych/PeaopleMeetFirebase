export const getCurrentPosition = (successCb) => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            if (typeof successCb === "function") {
                successCb(position);
            }
        })
    }
}