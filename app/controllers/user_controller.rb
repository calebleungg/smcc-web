class UserController < ApplicationController

    def index
        @albums = Album.where(public: true)
        @history = Section.find(1)
        @purpose = Section.find(2)
    end
    
end
