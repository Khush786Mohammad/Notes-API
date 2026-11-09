package com.khush.notes_api.exceptions;

import java.io.Serial;

public class CommonException extends Exception {
    @Serial
    private static final long serialVersionUID = 1L;

    public CommonException() {
        super();
    }

    public CommonException(final String message) {
        super(message);
    }
}
