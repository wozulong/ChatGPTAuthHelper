chrome.storage.local.get(['url'], function (result) {
    const url = new URL(result.url);
    const error = url.searchParams.get('error');
    const error_description = url.searchParams.get('error_description');
    const $txtTip = $('#txtTip');

    function showError(txt) {
        $txtTip.removeClass('text-success').addClass('text-danger').text(txt);
    }

    if (error) {
        showError('Error: ' + error + (error_description ? ', ' + error_description : ''));
        return;
    }

    let clipboard = new ClipboardJS(".clipboard");
    clipboard.on("success", (e) => {
        e.clearSelection();
        $(".copy-result").removeClass('text-danger').addClass('text-success').text("复制成功！");
    });
    clipboard.on("error", (e) => {
        $(".copy-result").removeClass('text-success').addClass('text-danger').text("复制失败。");
    });

    const data = {
        "callback": result.url
    };
    fetch('https://token.oaifree.com/auth/code/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.detail) {
                throw Error(data.detail);
            }

            $("#accessToken").text(data.access_token);
            $("#fullData").text(JSON.stringify(data, null, 2));

            $txtTip.slideUp();
            $("#stepThree").slideDown();
        })
        .catch((error) => {
            showError(error);
        });
});
