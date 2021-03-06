import { RecipeServce } from './../recipes/recipe.service';
import { Recipe } from './../recipes/recipe.model';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private http: HttpClient, private recipeService: RecipeServce){}

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://ng-recipe-book-f2bcf-default-rtdb.firebaseio.com/recipes.json',
        recipes).subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes(){
        return this.http.get<Recipe[]>('https://ng-recipe-book-f2bcf-default-rtdb.firebaseio.com/recipes.json')
        .pipe(map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        tap(recipes => {
            this.recipeService.setRecipes(recipes);
        })
        );
    }
}