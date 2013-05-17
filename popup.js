// Listen for any changes to the URL of any tab.
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true}, function(tabList) {
        init(tabList);
    });
});

function checkForValidUrl(tab) {
    if (tab.url.indexOf('verycd.com/topics') > -1)
    {
        $("#information").text("正在努力获取e2dk链接地址！");
        var newAddress = replaceURL(tab);
        $.ajax({
            type: 'get',
            url: newAddress,
            data: {},
            success: function(data) {
                var pattern = /(http:\/\/www.verycd.gdajie.com\/detail.htm\?id=(\d)*).>(.*?)(<\/a>)/;
                $("#information").text("链接地址如下：");
                var result;
                while ((result = pattern.exec(data)) !=null)
                {
                    data=data.substring(result.index+result[0].length);
                    var url_direct = result[1];
                    var name=result[3];
                    $.ajax({
                        type: 'get',
                        url: url_direct,
                        async:false,
                        data: {},
                        success: function(data) {
                            var pattern_direct = /ed2k:\/\/.*\/</;
                            var e2dk = pattern_direct.exec(data)[0];
                            e2dk = e2dk.substring(0, e2dk.length - 2);
                            var link="<li><span>"+name+"  :</span><a target='new' href='"+e2dk+"'>"+e2dk+"</a></li>";
                            $("#e2dk_list").append(link);
                        },
                        error: function() {
                            $("#information").text("对不起，获取失败，请刷新后重试一下！");
                        }
                    });
                }
            },
            error: function() {
                $("#information").text("该网页无法抓取，请求失败！俩选择：1：重试一下吧。2：摸摸头，我也没辙了");
            }
        });
    }
    else
        $("#information").text("亲，网站URL地址栏格式为(www.verycd.com/topics/xxxx)的才可以抓取'");
}
;

function replaceURL(tab)
{
    var sourceAddress = tab.url.toString();
    var firstpart = sourceAddress.substring(0, sourceAddress.indexOf('www.verycd.') + 11);
    var lastpart = sourceAddress.substring(sourceAddress.indexOf('www.verycd.') + 11);
    var newAddress = firstpart + "gdajie." + lastpart;
    return newAddress;
}

function init(tabList)
{
    checkForValidUrl(tabList[0]);
}



