const rp = require('request-promise');

function googleProxy(req, res) {
  rp({
    url:

`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.body.lat},${req.body.lng}&rankby=distance&types=${req.body.selection}&key=${process.env.GCLOUD_API_KEY_INFOGRAM}`,
    method: 'POST',
    json: true
  })
  .then((results) => {
    res.json(results);
  });
}
module.exports = {
  proxy: googleProxy
};
