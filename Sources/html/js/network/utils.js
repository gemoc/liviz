class Utils
{
    static httpGetAsync(theUrl, callback, error)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function ()
        {
            if (xmlHttp.readyState == 4)
            {
                if (xmlHttp.status == 200)
                {
                    callback(xmlHttp.responseText);
                }
                else
                {
                    error(xmlHttp.status);
                }
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }
}