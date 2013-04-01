package net.kenpowers.gea;

import android.app.ListActivity;
import android.app.SearchManager;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

public class SearchActivity extends ListActivity implements SearchCompleteListener {
	private MusicServiceObject searchResults[];
	private MusicServiceWrapper music = MusicServiceWrapper.getInstance(MainActivity.getAppContext());
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);
	
	    setContentView(R.layout.search);

	    // Get the intent, verify the action and get the query
	    Intent intent = getIntent();
	    if (Intent.ACTION_SEARCH.equals(intent.getAction())) {
	      String query = intent.getStringExtra(SearchManager.QUERY);
	      performSearch(query);
	    }
	    
	    music.togglePlayerPaused();
	    music.registerSearchCompleteListener(this);
	}
	
	public void performSearch(String query) {
		if (query.length() < 1) {
			Log.e(MainActivity.LOG_TAG, "Search submitted with no search text entered");
			return;
		}
		Log.d(MainActivity.LOG_TAG, query);
		music.search(query, "Song");
	}
	
	public void onSearchComplete(MusicServiceObject[] results) {
		searchResults = results;
		
		String resultsStrings[] = new String[searchResults.length];
		for (int i=0; i<results.length; i++)
			resultsStrings[i] = results[i].toString();
		
		setListAdapter(new ArrayAdapter<String>(this, R.layout.search_result, resultsStrings));
		
		ListView listview = getListView();
		listview.setOnItemClickListener(new AdapterView.OnItemClickListener() {
			public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
				listItemSelected(position);
			}
		});
		listview.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
			public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
				listItemSelected(position);
			}
			public void onNothingSelected(AdapterView<?> parent) {}
		});
	}
	
	public void listItemSelected(int position) {
		MusicServiceObject item = searchResults[position];
		if (item.getType().equals("track")) {
			MusicServiceWrapper.getInstance(MainActivity.getAppContext()).getPlayerForTrack((Track)item);
			finish();
		}
	}
	
	
	
	

}