export const json = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
    status
  });
}

export const readBearer = (request: Request) => {
  const authorization = request.headers.get('authorization');
  if (!authorization) {
    return null;
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2) {
    return null;
  }

  const scheme = parts[0];
  const token = parts[1];

  if (/^Bearer$/i.test(scheme)) {
    return token;
  }

  return null;
}
