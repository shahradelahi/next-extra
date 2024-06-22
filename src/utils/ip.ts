const IPV4_REGEX =
  /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
const IPV6_REGEX =
  /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!3)::|:\b|$))|(?!23)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;

export function isIP(ip: string | null) {
  return ip !== null && (IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip));
}
