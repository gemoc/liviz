
class Settings
{
    static bindEvents()
    {
        var button = document.getElementById('apply');

        button.onclick = function ()
        {
            var graph = Plotter.graphs.values().next().value;

            var xMin = document.getElementById('xMin').value;
            var xMax = document.getElementById('xMax').value;

            var yMin = document.getElementById('yMin').value;
            var yMax = document.getElementById('yMax').value;


            graph.rescale(xMin, xMax, yMin, yMax);
        }

        /*  sliderX.onchange = function ()
          {
             
              graph.rescaleX(this.value);
          }
  
  
          var sliderY = document.getElementById('windowY');
  
          sliderY.onchange = function ()
          {
              var graph = Plotter.graphs.values().next().value;
              graph.rescaleY(this.value);
          } */

    }

}