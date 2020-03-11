class AlbumController < ApplicationController

    def show
        @album = Album.find(params[:id])
        @photos = @album.photos
    end

    def create
        album = Album.create(
            title: params[:title],
            description: params[:description]
        )
        album.public = false
        if album.valid? && album.save
            redirect_back(fallback_location: admin_path)
        end
    end

    def update_public
        album = Album.find(params[:id])
        album.public = true
        album.save
        redirect_back(fallback_location: root_path)
    end

    def update_private
        album = Album.find(params[:id])
        album.public = false
        album.save
        redirect_back(fallback_location: root_path)
    end
    
end
