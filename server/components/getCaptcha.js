import svgCaptcha from 'svg-captcha';

const getCaptcha =  async ( req, res) => {
  var captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1ilIgqp',
    noise: 2,
    color: true,
    background: '#d6d6d6',
    height: 54,
    width: 140,
  });

  res.type('svg');
  res.set('Captcha', captcha.text);
  res.set("CharacterEncoding","UTF-8");
  res.set("ContentType","application/json");
	res.status(200).send(captcha);
}

export default getCaptcha;