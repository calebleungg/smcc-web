class PhotoController < ApplicationController

    def add
        album = Album.find(params[:id])
        photo = album.photos.create(
            title: params[:title]
        )
        photo.image.attach(params[:image])

        if photo.valid? && photo.save
            redirect_back(fallback_location: root_path)
        end
    end
    
end
