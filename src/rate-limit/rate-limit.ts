import rateLimit from 'express-rate-limit';
import * as requestIp from 'request-ip';

export const signUpRequestLimit = rateLimit({
  windowMs: 10 * 1000, // 10 sec windows
  max: 5, // start blocking after 10 requests
  message:
    'Too many accounts created from this IP, please try again after an 10 sec',
  keyGenerator: (req) => requestIp.getClientIp(req),
});
export const signUpRequestLimitRegistration = rateLimit({
  windowMs: 10 * 1000, // 10 sec windows
  max: 5, // start blocking after 10 requests
  message:
    'Too many accounts created from this IP, please try again after an 10 sec',
  keyGenerator: (req) => requestIp.getClientIp(req),
});
export const signUpRequestLimitRC = rateLimit({
  windowMs: 10 * 1000, // 10 sec windows
  max: 5, // start blocking after 10 requests
  message:
    'Too many accounts created from this IP, please try again after an 10 sec',
  keyGenerator: (req) => requestIp.getClientIp(req),
});
export const signUpRequestLimitRER = rateLimit({
  windowMs: 10 * 1000, // 10 sec windows
  max: 5, // start blocking after 10 requests
  message:
    'Too many accounts created from this IP, please try again after an 10 sec',
  keyGenerator: (req) => requestIp.getClientIp(req),
});
