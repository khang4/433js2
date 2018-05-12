<!doctype html>

<html>

  <head>
    <meta charset="UTF-8">

    <link rel="stylesheet" type="text/css" href="webp2.css">

    <script src="webp2.js"></script>
  </head>

  <body>
    <div class="wrap">
      <div class="readme-box">
        <h3>notes</h3>
        <ul>
          <li>press the + button to add a file input which you can put a file into. it won't let you have more than 1 empty file input, so you have to put a file into the input before making another input, of which you can have 5 (as required)</li>
          <li>you have to press upload to actually upload of course</li>
          <li>click the table's top header labels to sort, clicking the same label again toggles ascending or descending (like normal file explorers)</li>
          <li>theres no confirmation for the delete button -_-</li>
          <li>theres some files bigger than 50kb as i removed the restriction when uploading test files, but the restriction is in place now</li>
          <li>im wasnt sure which way the arrows should point while sorting so they might point the wrong way (if there even is a right way)</li>
        </ul>
      </div>

      <div class="file-list">
        <dl class="table-label">
          <dt class="selected">filename</dt>
          <dd>size</dd>
          <dd class="type">type</dd>
          <dd class="mod-time">modified</dd>
          <dd class="delete"></dd>
        </dl>

        <span>

        </span>
      </div>

      <div class="upload-zone">
        <div class="upload-controls">
          <div class="actual add-file">
            <span class="info-label">add a file</span>
            <span class="plus">+</span>
            <span class="info-label filecount">0/5</span>
          </div>

          <div class="upload-button add-file">
            <p class="upload">UPLOAD</p>
          </div>
        </div>

        <div class="file-inputs">
          <!-- <div class="upload-statusbox">レポートのドラフト.. uploaded</div> -->
        </div>
      </div>
    </div>
  </body>

</html>
