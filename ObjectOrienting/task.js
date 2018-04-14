function solve() {
    var module = (function () {

        var playable,
            audio,
            video,
            validator,
            CONSTANTS = {
                TEXT_MIN_LEN: 3,
                TEXT_MAX_LEN: 25
            };

        validator = {
            validateIfUndefined: function (val, name) {
                name == name || 'Value';
                if (val === undefined) {
                    throw new Error(`${name} cannot be undefined`)
                }
            },
            validateString: function (val, name) {

                name == name || 'Value';
                this.validateIfUndefined(val, name);

                if (typeof val !== 'string') {
                    throw new Error(`${name} must be a string`)
                }

                if (val.length < CONSTANTS.TEXT_MIN_LEN || val.length > CONSTANTS.TEXT_MAX_LEN) {
                    throw new Error(`${name} must be between ${CONSTANTS.TEXT_MIN_LEN} and ${CONSTANTS.TEXT_MAX_LEN}`)
                }
            },

            validateImdbRating: function (val) {
                this.validateIfUndefined(val, 'IMDB Rating');
                if (val < 1 || val > 5) {
                    throw new Error('IMDB must be between 1 and 5')
                }
            },

            validatePositiveNumber: function (val, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);

                if (typeof val !== 'number') {
                    throw new Error(name + 'must be a number');
                }

                if (val <= 0) {
                    throw new Error(name + 'must be a positive')
                }
            }
        }

        playable = (function () {
            var currentPlayableId = 0;
            var playable = Object.create({});

            Object.defineProperty(playable, 'init', {
                value: function (title, author) {
                    this.title = title;
                    this.author = author;
                    this._id = ++currentPlayableId;
                    return this;
                }
            })

            Object.defineProperty(playable, 'id', {
                get: function () {
                    return this._id;
                }
            })

            Object.defineProperty(playable, 'title', {
                get: function () {
                    return this._title;
                },

                set: function (val) {
                    validator.validateString(val, 'Playable Text');
                    this._title = val;
                }
            })

            Object.defineProperty(playable, 'author', {
                get: function () {
                    return this._author;
                },

                set: function (val) {
                    validator.validateString(val, 'Playable Author');
                    this._author = val;
                }
            })

            Object.defineProperty(playable, 'play', {
                value: function () {
                    return `${this.id}. ${this.title} - ${this.author}`
                }
            })


            return playable;
        }());

        audio = (function (parent) {
            var audio = Object.create(parent);

            Object.defineProperty(audio, 'init', {
                value: function (title, author, length) {
                    parent.init.call(this, title, author);
                    this.length = length;
                    return this;
                }
            });

            Object.defineProperty(audio, 'length', {
                get: function () {
                    return this._length;
                },

                set: function (val) {
                    validator.validatePositiveNumber(val, 'Audio Lenght');
                    this._length = val;
                }
            })

            Object.defineProperty(audio, 'play', {
                value: function () {
                    return parent.play.call(this) + ' - ' + this.length;
                }
            })

            return audio;
        }(playable));

        video = (function (parent) {
            var video = Object.create(parent);

            Object.defineProperty(video, 'init', {
                value: function (title, author, imdbRating) {
                    parent.init.call(this, title, author);
                    this.imdbRating = imdbRating;
                    return this;
                }
            })

            Object.defineProperty(video, 'imdbRating', {
                get: function () {
                    return this._imdbRating;
                },

                set: function (val) {
                    validator.validateImdbRating(val);
                    this._imdbRating = val;
                }
            })


            Object.defineProperty(video, 'play', {
                value: function () {
                    return parent.play.call(this) + ' - ' + this.imdbRating;
                }
            })

            return video;
        }(playable));

        return {
            getPlayer: function (name) {
                // returns a new player instance with the provided name
            },
            getPlaylist: function (name) {
                //returns a new playlist instance with the provided name
            },
            getAudio: function (title, author, length) {
                return Object.create(audio).init(title, author, length);
            },
            getVideo: function (title, author, imdbRating) {
                return Object.create(video).init(title, author, imdbRating);
            }
        }
    }());

    return module;
}

var module = solve();

for (var i = 1; i <= 10; i++) {
    var currentAudio = module.getAudio('Audio ' + i, 'Author ' + i, i);
    console.log(currentAudio.play());
}

for (var i = 1; i <= 10; i++) {
    var currentVideo = module.getVideo('Video ' + i, 'Video ' + i, 3.5);
    console.log(currentVideo.play());
}