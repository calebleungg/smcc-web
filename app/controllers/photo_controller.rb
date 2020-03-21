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

    def move_up
        photo = Photo.find(params[:id])
        album = Album.find(photo.album_id)
        replace = album.photos.where(position: photo.position - 1).first
        replace.position = photo.position
        photo.position -= 1
        if replace.save && photo.save
            redirect_back(fallback_location: album_path(album))
        end
    end

    def move_down
        photo = Photo.find(params[:id])
        album = Album.find(photo.album_id)
        replace = album.photos.where(position: photo.position + 1).first
        replace.position = photo.position
        photo.position += 1
        if replace.save && photo.save
            redirect_back(fallback_location: album_path(album))
        end
    end
    
end
