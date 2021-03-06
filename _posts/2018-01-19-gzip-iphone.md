---
layout: post
title:  "gzip on the iphone"
tags: development gzip iphone
---

Before sending out some data from the iphone, I wanted to compress it in a well known format.
I didn't find a simple solution to this, so I wrote this function:

```
#import "zlib.h"
```

```
- (NSData *)gzip:(NSData *)data {
    z_stream strm;
    strm.zalloc    = Z_NULL;
    strm.zfree     = Z_NULL;
    strm.opaque    = Z_NULL;
    strm.total_out = 0;
    strm.next_in   = (Bytef *)[data bytes];
    strm.avail_in  = (uInt)[data length];
    
    if (Z_OK != deflateInit2(&strm,
                             Z_DEFAULT_COMPRESSION, Z_DEFLATED,
                             (15+16), 8,
                             Z_DEFAULT_STRATEGY))
        return NULL;
    
    const NSUInteger inc = 16384;
    NSUInteger len = [data length];
    if (len < inc)
        len = inc;
    
    int flag;
    
    NSMutableData *cmp = [NSMutableData dataWithLength:len];
    do {
        if (strm.total_out >= [cmp length])
            [cmp increaseLengthBy: inc];
        
        strm.next_out = [cmp mutableBytes] + strm.total_out;
        strm.avail_out = (uInt)([cmp length] - strm.total_out);
        
        flag = deflate(&strm, Z_FINISH);
        
    } while (flag == Z_OK && strm.avail_out == 0);
    
    uInt inlen = strm.avail_in;
    uLong outlen = strm.total_out;
    
    deflateEnd(&strm);
    
    if (inlen == 0)
        [cmp setLength: outlen];
    else
        return NULL;

    return [NSData dataWithData:cmp];
}
```

The iphone includes the [zlib] library, which includes numerous compress routines.
Although the library can handle streams, this function works on NSData.
The `strm` structure is configured to read all of the bytes in the NSData.
The call to `deflateInit2` configures the compression to be `gzip` compatiable.
The loop resizes the output buffer as necessary.
The terminating condition is a bit subtle and could be improved.
The loop will exit if deflate has a problem or the output buffer has spare capacity.
The subtle aspect is if both conditions are false: is the compress complete when the input buffer is completely read but and error occured?
I carefully copy out elements of the `strm` structure before calling `deflateEnd`.

`deflateInit2` has a several parameters: `Z_DEFAULT_COMPRESSION` selects a balance between speed and compactness,
`Z_DEFLATED` is required, `(15+16)` is the `windowBits`, `8` is the default value for the amount of memory to use,
and `Z_DEFAULT_STRATEGY` uses a default value for the compression strategy.
`windowBits` is the log base 2 of the historical window size: 15 indicates a 32K window size.
Negative values are permitted too where the negative sign flags that a raw stream
(lacking a header or check value) should be generated.
Adding 16 to the value flags that a `gzip` header and check value should be used.

[zlib]: http://zlib.net
