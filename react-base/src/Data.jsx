import React, { Component } from 'react';
import axios, { put } from 'axios';

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      viddescription: 'description',
      vidtags: 'tag1',
      vidtitle: 'title',
      vidprivacy: 'private',
      token: this.props.token
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onFormSubmit(e) {
    e.preventDefault() // Stop form submit
    // this.defineRequest(this.state.file).then((response) => {
    //   console.log(response.data);
    // })
    this.defineRequest(this.state.file)
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  MediaUploader = function (options) {
    var noop = function () { };
    this.file = options.file;
    this.contentType = options.contentType || this.file.type || 'application/octet-stream';
    this.metadata = options.metadata || {
      'title': this.file.name,
      'mimeType': this.contentType
    };
    this.token = options.token;
    this.onComplete = options.onComplete || noop;
    this.onProgress = options.onProgress || noop;
    this.onError = options.onError || noop;
    this.offset = options.offset || 0;
    this.chunkSize = options.chunkSize || 0;

    console.log('inside mediauploader')

    this.url = options.url;
    if (!this.url) {
      var params = options.params || {};
      params.uploadType = 'resumable';
      
      this.url = function (id, params2, baseUrl) {
        id = options.fileId
        params2 = params
        baseUrl = options.baseUrl
        var url = baseUrl;
        if (id) {
          url += id;
        }
        var query = this.buildQuery_(params2);
        if (query) {
          url += '?' + query;
        }
        return url;
      };
      
    }
    this.httpMethod = options.fileId ? 'PUT' : 'POST';

      var self = this;
      var xhr = new XMLHttpRequest();

      console.log('inside upload')

      xhr.open(this.httpMethod, this.url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-Upload-Content-Length', this.file.size);
      xhr.setRequestHeader('X-Upload-Content-Type', this.contentType);

      xhr.onload = function (e) {
        if (e.target.status < 400) {
          var location = e.target.getResponseHeader('Location');
          this.url = location;
          sendFile_();
        } else {
          onUploadError_(e);
        }
      }.bind(this);
      xhr.onerror = this.onUploadError_.bind(this);
      xhr.send(JSON.stringify(this.metadata));;


    var sendFile_ = function () {
      var content = this.file;
      var end = this.file.size;

      if (this.offset || this.chunkSize) {
        // Only slice the file if we're either resuming or uploading in chunks
        if (this.chunkSize) {
          end = Math.min(this.offset + this.chunkSize, this.file.size);
        }
        content = content.slice(this.offset, end);
      }

      var xhr = new XMLHttpRequest();
      xhr.open('PUT', this.url, true);
      xhr.setRequestHeader('Content-Type', this.contentType);
      xhr.setRequestHeader('Content-Range', 'bytes ' + this.offset + '-' + (end - 1) + '/' + this.file.size);
      xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', this.onProgress);
      }
      xhr.onload = this.onContentUploadSuccess_.bind(this);
      xhr.onerror = this.onContentUploadError_.bind(this);
      xhr.send(content);
    };


    var extractRange_ = function (xhr) {
      var range = xhr.getResponseHeader('Range');
      if (range) {
        this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
      }
    };

    var onContentUploadSuccess_ = function (e) {
      if (e.target.status == 200 || e.target.status == 201) {
        this.onComplete(e.target.response);
      } else if (e.target.status == 308) {
        this.extractRange_(e.target);
        this.retryHandler.reset();
        this.sendFile_();
      }
    };

    var onContentUploadError_ = function (e) {
      if (e.target.status && e.target.status < 500) {
        this.onError(e.target.response);
      } else {
        this.retryHandler.retry(this.resume_.bind(this));
      }
    };

    var onUploadError_ = function (e) {
      this.onError(e.target.response); // TODO - Retries for initial upload
    };

    var buildQuery_ = function (params) {
      params = params || {};
      return Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    };
  };

  defineRequest(file) {
    function createResource(properties) {
      var resource = {};
      var normalizedProps = properties;
      for (var p in properties) {
        var value = properties[p];
        if (p && p.substr(-2, 2) == '[]') {
          var adjustedName = p.replace('[]', '');
          if (value) {
            normalizedProps[adjustedName] = value.replace(' ', '').split(',');
          }
          delete normalizedProps[p];
        }
      }
      for (var p in normalizedProps) {
        // Leave properties that don't have values out of inserted resource.
        if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
          var propArray = p.split('.');
          var ref = resource;
          for (var pa = 0; pa < propArray.length; pa++) {
            var key = propArray[pa];
            if (pa == propArray.length - 1) {
              ref[key] = normalizedProps[p];
            } else {
              ref = ref[key] = ref[key] || {};
            }
          }
        };
      }
      return resource;
    }

    var metadata = createResource({
      // 'snippet.categoryId': '22',
      // 'snippet.defaultLanguage': '',
      'snippet.description': this.state.viddescription,
      'snippet.tags[]': this.state.vidtags,
      'snippet.title': this.state.vidtitle,
      // 'status.embeddable': '',
      // 'status.license': '',
      'status.privacyStatus': this.state.vidprivacy,
      // 'status.publicStatsViewable': ''
    });
    console.log(metadata);

    var token = this.props.token
    if (token === '') {
      alert("You need to login and authorize the request to proceed.");
      return;
    }

    if (file === null) {
      alert("You need to select a file to proceed.");
      return;
    }
    var params = {
      'part': 'snippet,status'
    };



    this.MediaUploader({
      baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
      file: !this.state.file,
      token: token,
      metadata: metadata,
      params: params,
      onError: function (data) {
        var message = data;
        try {
          var errorResponse = JSON.parse(data);
          message = errorResponse.error.message;
        } finally {
          alert(message);
        }
      }.bind(this),
      onProgress: function (data) {
        var currentTime = Date.now();
        console.log('Progress: ' + data.loaded + ' bytes loaded out of ' + data.total);
        var totalBytes = data.total;
      }.bind(this),
      onComplete: function (data) {
        var uploadResponse = JSON.parse(data);
      }.bind(this)
    })

    // uploader here
  }
  render() {
    return (
      <div>
        <h1>File Upload</h1>
        <form onSubmit={this.onFormSubmit}>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default Data;