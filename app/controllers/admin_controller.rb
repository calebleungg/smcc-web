class AdminController < ApplicationController

    def manager
        @albums = Album.all
        @section1 = Section.find(1)
        @section2 = Section.find(2)
    end
    
end
