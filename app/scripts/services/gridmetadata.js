'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.GridMetadata
 * @description
 * # GridMetadata
 * Service in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
  .service('GridMetadata', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
        this.options = function (cellTemplate) {
            return {
                showGridFooter: true,
                enableSorting: true,
                enableFiltering: true,
                cellEditableCondition: true,
                exporterMenuCsv: true,
                exporterMenuPdf: false,
                enableGridMenu: true,
                columnDefs: [{
                    field: "Download",
                    width: '7%',
                    displayName: '',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableColumnMenu: false,
                    cellTemplate: cellTemplate,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return 'text-center';
                    },
                }, {
                    field: "sample_name",
                    width: '15%'
                }, {
                    field: "user",
                    width: '8%',
                    displayName: 'User'
                }, {
                    field: "file_names",
                    width: '20%',
                    displayName: 'File Names'
                }, {
                    field: "created_on",
                    displayName: 'Uploaded on',
                    width: '25%',
                    cellFilter: 'date'
                }, {
                    field: "sequencing_platform",
                    width: '15%'
                }, {
                    field: "sequencing_type",
                    width: '15%'
                }, {
                    field: "pre_assembled",
                    width: '25%'
                }, {
                    field: "sample_type",
                    width: '25%'
                }, {
                    field: "organism",
                    width: '25%'
                }, {
                    field: "strain",
                    width: '25%'
                }, {
                    field: "subtype",
                    width: '25%'
                }, {
                    field: "country",
                    width: '25%'
                }, {
                    field: "region",
                    width: '25%'
                }, {
                    field: "city",
                    width: '25%'
                }, {
                    field: "zip_code",
                    width: '25%'
                }, {
                    field: "longitude",
                    width: '25%'
                }, {
                    field: "latitude",
                    width: '25%'
                }, {
                    field: "location_note",
                    width: '25%'
                }, {
                    field: "isolation_source",
                    width: '25%'
                }, {
                    field: "source_note",
                    width: '25%'
                }, {
                    field: "pathogenic",
                    width: '25%'
                }, {
                    field: "pathogenicity_note",
                    width: '25%'
                }, {
                    field: "collection_date",
                    width: '25%'
                }, {
                    field: "collected_by",
                    width: '25%'
                }, {
                    field: "usage_restrictions",
                    width: '25%'
                }, {
                    field: "release_date",
                    width: '25%'
                }, {
                    field: "email_address",
                    width: '25%'
                }, {
                    field: "notes",
                    width: '25%'
                }, ],
            };
        };
  });
