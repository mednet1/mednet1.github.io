var myApp = angular.module("myAppControllers",[]);

function csvJSON(csv){

// alert(csv);
  csv = csv.replace("\r","");
  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");
  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");
      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

  }
  
  console.log("Final: "+JSON.stringify(result));
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

myApp.controller('dashController',['$scope','$http','$location','$timeout','NgTableParams',function($scope,$http,$location,$timeout,NgTableParams){



// data manip
$scope.init_values = function()
{

  // hashmap for values
  $scope.hashmap = {};
  $scope.hashmap['sector'] = "sector";
  $scope.hashmap['lesion_size'] = "lesion_size";

  $scope.pirads = {};
  $scope.gleason = {};
  $scope.sector = {};
  $scope.lesion = {};
 
  $scope.pirads_final = [];
  $scope.gleason_final = [];
  $scope.sector_final = [];
  $scope.lesion_final = [];

  $scope.footer_caption = "";
  
  // fixed variables
    $scope.access = ["Open <i class='fa fa-unlock'></i>","Closed <i class='fa fa-lock'></i>"];
    $scope.project = [
    {long:"Acinar adenocarcinoma",
    short:'AA'
    },
    {long:"Ductal adenocarcinoma",
    short:'DA'},
    {long:"Transitional Cell (or urothelial) Cancer",
    short:'TCC'},
    {long:"Squamous Cell Cancer",
    short:'SCC'},
    {long:"Small Cell Prostate Cancer",
    short:'SMPC'},
    {long:"Carcinoid",
    short:'Carc'},
    {long:"Sarcoma",
    short:"Sarc"}];
    $scope.category = ["Transcriptome Profiling","Clinical"];
};

// pagination
$scope.set_pagination = function()
{
                    $scope.viewby = 10;
                    $scope.totalItems = $scope.data1.length;
                    $scope.currentPage = 1;
                    $scope.itemsPerPage = $scope.viewby;
                    $scope.maxSize = 5; //Number of pager buttons to show
                    $scope.numPages = Math.ceil($scope.totalItems/$scope.viewby);

                    $scope.setPage = function (pageNo) {
                      $scope.currentPage = pageNo;
                    };

                    $scope.pageChanged = function() {
                      console.log('Page changed to: ' + $scope.currentPage);
                    };

                  $scope.setItemsPerPage = function(num) {
                    $scope.itemsPerPage = num;
                    $scope.currentPage = 1; //reset to first page
                  };
};

// ogl charts
$scope.ogl = function()
{
  $http({method: 'GET', url: 'sample-data.csv'}).success(function(data)
           {
                     $scope.data1 = csvJSON(data);
                     console.log($scope.data1);
                     $scope.data1 = JSON.parse($scope.data1);
                     // add random values to data
                     for(var i = 0; i< $scope.data1.length; i++)
                     {
                      var idx = Math.floor(Math.random() * $scope.project.length);
                      $scope.data1[i].access = $scope.access[Math.floor(Math.random() * $scope.access.length)];
                      $scope.data1[i].project_long = $scope.project[idx].long;
                      $scope.data1[i].project_short = $scope.project[idx].short;
                      $scope.data1[i].category = $scope.category[Math.floor(Math.random() * $scope.category.length)];
                     }
                     $scope.all_data_function($scope.data1);
                     $scope.set_pagination();
                     });
};

$scope.showTab = function(tabId)
{
  // set active tab color
  $(".tab").removeClass("tab-active");
  $("#tab"+tabId).addClass("tab-active");

  setTimeout(function () {
        $scope.$apply(function(){
            $scope.selectedTab = tabId;
        });
    }, 0);

};

// functions for data handling
$scope.all_data_function = function(subset_data)
{
 $scope.init_values();                    
  for(var i = 0; i < subset_data.length; ++i)
  {
    // pirads
    if(typeof $scope.pirads[subset_data[i].PIRADS_score]=='undefined')
      $scope.pirads[subset_data[i].PIRADS_score] = 1;
    else
    $scope.pirads[subset_data[i].PIRADS_score]++;
    if(typeof $scope.gleason[subset_data[i].GLEASON_score]=='undefined')
      $scope.gleason[subset_data[i].GLEASON_score] = 1;
    else
    $scope.gleason[subset_data[i].GLEASON_score]++;
  // psv
    if(typeof $scope.sector[subset_data[i].sector]=='undefined')
      $scope.sector[subset_data[i].sector] = 1;
    else
    $scope.sector[subset_data[i].sector]++;
  if(typeof $scope.lesion[subset_data[i].lesion_size]=='undefined')
      $scope.lesion[subset_data[i].lesion_size] = 1;
    else
    $scope.lesion[subset_data[i].lesion_size]++;
  }

  $.each($scope.pirads, function(key, value) {
    var pp = {};
    pp['label'] = key;
    pp['value'] = value;
    $scope.pirads_final.push(pp);
    });
  $.each($scope.gleason, function(key, value) {
  var pp = {};
  pp['label'] = key;
  pp['value'] = value;
  $scope.gleason_final.push(pp);
  });
  $.each($scope.sector, function(key, value) {
  var pp = {};
  pp['label'] = key;
  pp['value'] = value;
  $scope.sector_final.push(pp);
  });
  $.each($scope.lesion, function(key, value) {
  var pp = {};
  pp['label'] = key;
  pp['value'] = value;
  $scope.lesion_final.push(pp);
  });

};


// init variables
$scope.init_values();
 // processing data for files table
$scope.ogl();
// tabs
$scope.selectedTab = 1;
$("#tab1").addClass("tab-active");

// nvd3 charts
// onclick
$scope.changeCharts = function(chart_id,key)
{
  var subset_data = [];
  for(var i = 0; i < $scope.data1.length; ++i)
  {
    if($scope.data1[i][$scope.hashmap[chart_id]] == key)
    {
      subset_data.push($scope.data1[i]);
    }
  }
// update charts
$scope.all_data_function(subset_data);
// update footer captions
$scope.footer_caption = $scope.hashmap[chart_id].charAt(0).toUpperCase()+$scope.hashmap[chart_id].slice(1).split("_").join(" ")+" : "+key;

$scope.$apply();
};

// PIRADS
 $scope.options_pirads = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showLabels: false,
                duration: 0,
                labelThreshold: 0.01,
                labelType: "percent",
                labelSunbeamLayout: true,
                labelsOutside: true,
                showLegend: false,
                tooltip:{
                    headerEnabled:true,
                   contentGenerator: function(data) {
                    var str = '<table class="table-striped tooltip-table"><thead><tr><th></th><th>PIRADS Score</th><th>Frequency</th></tr></thead>';
                    if(data.series.length !== 0)
                    {
                        str = str + '<tbody>';
                        data.series.forEach(function(d){
                            str = str + '<tr><td class="legend-color-guide"><div style="background-color:' + d.color + '"></div></td><td class="key">' + d.key + '</td><td class="value">' + d.value + '</td></tr>';
                        });
                        str = str + '</tbody>';
                    }
            str = str + '</table>';
            return str;
                        }
                },
                valueFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                legend: {
                    margin: {
                        top: 30,
                        right: 20,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };
 
// gleason
$scope.options_gleason = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showLabels: false,
                duration: 0,
                labelThreshold: 0.01,
                labelType: "percent",
                labelSunbeamLayout: true,
                labelsOutside: true,
                showLegend: false,
                tooltip:{
                    headerEnabled:true,
                   contentGenerator: function(data) {
                    var str = '<table class="table-striped tooltip-table"><thead><tr><th></th><th>GLEASON Score</th><th>Frequency</th></tr></thead>';
                    if(data.series.length !== 0)
                    {
                        str = str + '<tbody>';
                        data.series.forEach(function(d){
                            str = str + '<tr><td class="legend-color-guide"><div style="background-color:' + d.color + '"></div></td><td class="key">' + d.key + '</td><td class="value">' + d.value + '</td></tr>';
                        });
                        str = str + '</tbody>';
                    }
            str = str + '</table>';
            return str;
                        }
                },
                valueFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                legend: {
                    margin: {
                        top: 30,
                        right: 20,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

// sectors
$scope.options_sector = {
            chart: {
                type: 'pieChart',
                pie:
              {
              dispatch: {
                  chartClick: function(e) {},
                  elementClick: function(e) {
                    $scope.changeCharts('sector',e.data.label);
                  },
                  elementDblClick: function(e) {},
                  elementMouseover: function(e) {},
                  elementMouseout: function(e) {}            
                    }
                  },
                height: 300,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showLabels: false,
                duration: 0,
                labelThreshold: 0.01,
                labelType: "percent",
                labelSunbeamLayout: true,
                labelsOutside: true,
                showLegend: false,
                tooltip:{
                    headerEnabled:true,
                contentGenerator: function(data) {
                    var str = '<table class="table-striped tooltip-table"><thead><tr><th></th><th>Sector Affected</th><th>Frequency</th></tr></thead>';
                    if(data.series.length !== 0)
                    {
                        str = str + '<tbody>';
                        data.series.forEach(function(d){
                            str = str + '<tr><td class="legend-color-guide"><div style="background-color:' + d.color + '"></div></td><td class="key">' + d.key + '</td><td class="value">' + d.value + '</td></tr>';
                        });
                        str = str + '</tbody>';
                    }
            str = str + '</table>';
            return str;
                        }
                      },
                valueFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                legend: {
                    margin: {
                        top: 30,
                        right: 20,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

// lesions
$scope.options_lesion = {
            chart: {
                type: 'pieChart',
                 pie:
              {
              dispatch: {
                  chartClick: function(e) {},
                  elementClick: function(e) {
                    $scope.changeCharts('lesion_size',e.data.label);
                  },
                  elementDblClick: function(e) {},
                  elementMouseover: function(e) {},
                  elementMouseout: function(e) {}            
                    }
                  },
               
                height: 300,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showLabels: false,
                duration: 0,
                labelThreshold: 0.01,
                labelType: "percent",
                labelSunbeamLayout: true,
                labelsOutside: true,
                showLegend: false,
                tooltip:{
                    headerEnabled:true,
                    contentGenerator: function(data) {
                    var str = '<table class="table-striped tooltip-table"><thead><tr><th></th><th>Lesion Size</th><th>Frequency</th></tr></thead>';
                    if(data.series.length !== 0)
                    {
                        str = str + '<tbody>';
                        data.series.forEach(function(d){
                            str = str + '<tr><td class="legend-color-guide"><div style="background-color:' + d.color + '"></div></td><td class="key">' + d.key + '</td><td class="value">' + d.value + '</td></tr>';
                        });
                        str = str + '</tbody>';
                    }
            str = str + '</table>';
            return str;
                        }
                },
                valueFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                legend: {
                    margin: {
                        top: 30,
                        right: 20,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };


// onclick for charts



}]);